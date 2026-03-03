
import { createClient } from '@supabase/supabase-js';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

// --- 1. MANUAL ENV PARSER ---
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length) {
        env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

// Init Supabase & Firebase
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const fbApp = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
});
const db = getFirestore(fbApp);

async function uploadToSupabase(localPath, folder) {
    try {
        const cleanLocalPath = localPath.replace(/^\//, '');
        const fullLocalPath = path.resolve(process.cwd(), 'public', cleanLocalPath);
        if (!fs.existsSync(fullLocalPath)) return null;

        const fileBuffer = fs.readFileSync(fullLocalPath);
        const fileName = `${Date.now()}_${path.basename(localPath)}`;
        const storagePath = `${folder}/${fileName}`;

        console.log(`📤 Supabase Uploading: ${localPath} -> ${storagePath}`);
        
        const { data, error } = await supabase.storage
            .from('assets') // تأكد إنك عملت بوكت اسمه 'assets'
            .upload(storagePath, fileBuffer, {
                contentType: localPath.endsWith('.svg') ? 'image/svg+xml' : 'image/webp',
                upsert: true
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(storagePath);
        return publicUrl;
    } catch (err) {
        console.error(`❌ Supabase Failed ${localPath}: ${err.message}`);
        return null;
    }
}

async function startMigration() {
    console.log("🚀 STARTING SUPABASE MIGRATION...");

    // 1. BEST MEMBERS
    const bmData = JSON.parse(fs.readFileSync('src/data/bestMembers.json', 'utf8'));
    for (const bm of bmData) {
        const url = await uploadToSupabase(bm.img || bm.image, 'bestMembers');
        if (url) {
            await setDoc(doc(db, 'bestMembers', bm.name.replace(/\s+/g, '_')), {
                ...bm,
                image: url,
                createdAt: serverTimestamp()
            }, { merge: true });
            console.log(`✅ ${bm.name} Linked (Supabase)`);
        }
    }

    // 2. COMMITTEES
    const commData = JSON.parse(fs.readFileSync('src/data/committees.json', 'utf8'));
    for (const comm of commData) {
        const cover = await uploadToSupabase(comm.image, 'committees');
        await setDoc(doc(db, 'committees', comm.name), {
            ...comm,
            image: cover || comm.image,
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log(`✅ Committee ${comm.name} Linked (Supabase)`);
    }

    console.log("\n🏁 SUCCESS! SUPABASE IS NOW HOSTING ALL YOUR ASSETS.");
    process.exit(0);
}

startMigration();
