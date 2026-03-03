
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// --- MANUAL ENV PARSER ---
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length) {
        env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function uploadImage(localPath, folder) {
    try {
        if (!localPath || localPath.startsWith('http')) return localPath;
        
        const cleanLocalPath = localPath.replace(/^\//, '');
        const fullLocalPath = path.resolve(process.cwd(), 'public', cleanLocalPath);
        
        if (!fs.existsSync(fullLocalPath)) return null;

        const fileBuffer = fs.readFileSync(fullLocalPath);
        const fileName = `${path.basename(localPath)}`; // شيلنا التوقيت عشان لو تكرر الرفع ميعملش ملفات كتير
        const storagePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('assets')
            .upload(storagePath, fileBuffer, {
                contentType: localPath.endsWith('.svg') ? 'image/svg+xml' : 'image/webp',
                upsert: true
            });

        if (error && error.message !== 'The resource already exists' ) throw error;

        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(storagePath);
        return publicUrl;
    } catch (err) {
        console.error(`❌ Upload Failed ${localPath}: ${err.message}`);
        return null;
    }
}

async function migrate() {
    console.log("🔥 RESETTING & STARTING FULL SUPABASE MIGRATION...");

    // 0. Clean Tables to start fresh
    await supabase.from('committee_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('committees').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('best_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 1. Committees
    const committees = JSON.parse(fs.readFileSync('src/data/committees.json', 'utf8'));
    for (const comm of committees) {
        const coverUrl = await uploadImage(comm.image, 'committees');
        console.log(`💾 Saving Committee: ${comm.name}`);
        
        await supabase.from('committees').upsert({
            name: comm.name,
            title: comm.title,
            image: coverUrl,
            description: comm.description,
            responsibilities: comm.responsibilities
        }, { onConflict: 'name' });

        // Members
        const members = [];
        if (comm.team?.head) members.push({ ...comm.team.head, role: 'head' });
        if (comm.team?.vice) {
            if (Array.isArray(comm.team.vice)) comm.team.vice.forEach(v => members.push({ ...v, role: 'vice' }));
            else members.push({ ...comm.team.vice, role: 'vice' });
        }
        if (comm.team?.advisors) comm.team.advisors.forEach(a => members.push({ ...a, role: 'advisor' }));
        if (comm.team?.members) comm.team.members.forEach(m => members.push({ ...m, role: 'member' }));

        for (const m of members) {
            const mUrl = await uploadImage(m.image, `members/${comm.name}`);
            await supabase.from('committee_members').insert({
                committee_name: comm.name,
                name: m.name,
                image: mUrl,
                role: m.role,
                college: m.college,
                level: m.level
            });
        }
    }

    // 2. Best Members
    const bestMembers = JSON.parse(fs.readFileSync('src/data/bestMembers.json', 'utf8'));
    for (const bm of bestMembers) {
        const bmUrl = await uploadImage(bm.img || bm.image, 'best_members');
        await supabase.from('best_members').insert({
            name: bm.name,
            team: bm.team,
            image: bmUrl,
            college: bm.college,
            level: bm.level
        });
    }

    // 3. Events
    const events = JSON.parse(fs.readFileSync('src/data/events.json', 'utf8'));
    for (const event of events) {
        const cloudImages = [];
        for (const img of event.images) {
            const url = await uploadImage(img, `events/${event.id}`);
            if (url) cloudImages.push(url);
        }
        await supabase.from('events').upsert({
            id: event.id.toString(),
            title: event.title,
            date: event.date,
            images: cloudImages
        }, { onConflict: 'id' });
    }

    console.log("\n🏁 SUCCESS! SUPABASE IS NOW THE NEW HOME FOR YOUR DATA.");
    process.exit(0);
}

migrate();
