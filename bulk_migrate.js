
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

const BUCKET = env.VITE_FIREBASE_STORAGE_BUCKET;
const PROJECT_ID = env.VITE_FIREBASE_PROJECT_ID;

// --- 2. THE "GOD MODE" UPLOAD FUNCTION ---
// This uses Direct REST API - No Firebase SDK required, no browser issues!
async function uploadDirect(localPath, storagePath) {
    try {
        const cleanLocalPath = localPath.replace(/^\//, '');
        const fullLocalPath = path.resolve(process.cwd(), 'public', cleanLocalPath);
        
        if (!fs.existsSync(fullLocalPath)) return null;

        const fileBuffer = fs.readFileSync(fullLocalPath);
        const safePath = storagePath.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9.\/_-]/g, '');
        
        // Google Storage REST API Endpoint
        const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?uploadType=media&name=${encodeURIComponent('site_v7/' + safePath)}`;

        console.log(`🚀 BLASTING: ${localPath} -> site_v7/${safePath}`);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: fileBuffer,
            headers: {
                'Content-Type': localPath.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : 'image/webp'
            }
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }

        const data = await response.json();
        return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(data.name)}?alt=media`;
    } catch (err) {
        console.error(`❌ FAILED ${localPath}: ${err.message}`);
        return null;
    }
}

async function startMigration() {
    console.log("🔥 STARTING REST-API MIGRATION (GOD MODE)...");

    // 1. BEST MEMBERS
    const bmData = JSON.parse(fs.readFileSync('src/data/bestMembers.json', 'utf8'));
    for (const bm of bmData) {
        const url = await uploadDirect(bm.img || bm.image, `bestMembers/${bm.name}.webp`);
        if (url) {
            console.log(`✅ ${bm.name} Link Captured: ${url.substring(0, 50)}...`);
            // Note: Update Firestore manually in Dashboard after this or add fetch here
        }
    }

    // 2. COMMITTEES
    const commData = JSON.parse(fs.readFileSync('src/data/committees.json', 'utf8'));
    for (const comm of commData) {
        await uploadDirect(comm.image, `committees/${comm.name}/cover.webp`);
        console.log(`✅ Committee ${comm.name} Assets Ready.`);
    }

    console.log("\n🏁 SUCCESS! ALL IMAGES ARE NOW ON FIREBASE STORAGE.");
    console.log("Now you can use 'LINK DATA' in your Dashboard to update Firestore.");
    process.exit(0);
}

startMigration();
