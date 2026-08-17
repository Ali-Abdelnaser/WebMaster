// supabase/functions/genesis-upload-url/index.ts
// Secure server-side signed upload URL generator for Genesis National ID documents

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GENESIS_DEADLINE = new Date("2026-08-27T00:00:00+03:00");

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Deadline Check
    if (new Date() >= GENESIS_DEADLINE) {
      return new Response(
        JSON.stringify({
          error: "GENESIS_REGISTRATION_CLOSED",
          message: "Registration deadline has passed.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Parse Request Body
    const body = await req.json().catch(() => ({}));
    const { session_id, object_path } = body;

    if (!session_id || !object_path || typeof session_id !== "string" || typeof object_path !== "string") {
      return new Response(
        JSON.stringify({
          error: "INVALID_REQUEST",
          message: "session_id and object_path are required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Strict path regex check: {reg_uuid}/{member_uuid}/(front|back).{ext}
    const pathRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/(front|back)\.(jpg|jpeg|png|webp|heic|heif|pdf)$/i;
    if (!pathRegex.test(object_path)) {
      return new Response(
        JSON.stringify({
          error: "INVALID_PATH_FORMAT",
          message: "The requested object path has an invalid structure.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Initialize Supabase Admin Client using protected environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables in Edge Function.");
      return new Response(
        JSON.stringify({
          error: "SERVER_CONFIG_ERROR",
          message: "Internal server configuration error.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Validate Session in Database
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("genesis_upload_sessions")
      .select("id, registration_id, authorized_paths, expires_at, consumed")
      .eq("id", session_id)
      .maybeSingle();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({
          error: "SESSION_NOT_FOUND",
          message: "Upload session was not found or is invalid.",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (session.consumed) {
      return new Response(
        JSON.stringify({
          error: "SESSION_CONSUMED",
          message: "Upload session has already been used.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (new Date(session.expires_at) <= new Date()) {
      return new Response(
        JSON.stringify({
          error: "SESSION_EXPIRED",
          message: "Upload session has expired. Please retry registration.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Verify Path Authorization
    const authorizedPaths: string[] = session.authorized_paths || [];
    if (!authorizedPaths.includes(object_path)) {
      return new Response(
        JSON.stringify({
          error: "UNAUTHORIZED_PATH",
          message: "The requested path is not authorized for this upload session.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 6. Generate Signed Upload URL on Private Bucket
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("genesis-id-documents")
      .createSignedUploadUrl(object_path);

    if (uploadError || !uploadData) {
      console.error("Failed to create signed upload URL:", uploadError);
      return new Response(
        JSON.stringify({
          error: "SIGNED_URL_FAILED",
          message: uploadError?.message || "Could not generate signed upload URL.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return the signed upload authorization token & URL
    return new Response(
      JSON.stringify({
        success: true,
        signedUrl: uploadData.signedUrl,
        token: uploadData.token,
        path: uploadData.path,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Unexpected Edge Function error:", err);
    return new Response(
      JSON.stringify({
        error: "INTERNAL_ERROR",
        message: err?.message || "An unexpected error occurred.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
