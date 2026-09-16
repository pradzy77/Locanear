async function ensureTables(db) {
    if (!db) return;
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                avatar TEXT NOT NULL DEFAULT 'cool',
                color TEXT NOT NULL DEFAULT '#10b981',
                friend_code TEXT UNIQUE NOT NULL,
                security_question TEXT,
                security_answer TEXT,
                lat REAL DEFAULT -6.2088,
                lng REAL DEFAULT 106.8456,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        await db.prepare(`
            CREATE TABLE IF NOT EXISTS friendships (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_code_a TEXT NOT NULL,
                user_code_b TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_code_a, user_code_b)
            )
        `).run();

    } catch (e) {}
}

export async function onRequestPost({ request, env }) {
    try {
        const { username, password, confirmPassword, securityQuestion, securityAnswer, invitedByCode } = await request.json();
        const uKey = String(username || '').trim().toLowerCase();
        const p = String(password || '').trim();
        const cp = String(confirmPassword || '').trim();
        const ans = String(securityAnswer || '').trim();

        if (!uKey || uKey.length < 3) {
            return new Response(JSON.stringify({ success: false, message: 'Username baru minimal 3 karakter!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(uKey)) {
            return new Response(JSON.stringify({ success: false, message: 'Username hanya boleh huruf, angka, underscore (_) atau strip (-)!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (p.length < 6) {
            return new Response(JSON.stringify({ success: false, message: 'Password minimal 6 karakter!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (!/[A-Z]/.test(p)) {
            return new Response(JSON.stringify({ success: false, message: 'Password harus mengandung minimal 1 huruf kapital (A–Z)!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (!/[0-9]/.test(p)) {
            return new Response(JSON.stringify({ success: false, message: 'Password harus mengandung minimal 1 angka (0–9)!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (p !== cp) {
            return new Response(JSON.stringify({ success: false, message: 'Konfirmasi password tidak cocok!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (!ans) {
            return new Response(JSON.stringify({ success: false, message: 'Harap isi jawaban pertanyaan keamanan pemulihan!' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (env.DB) {
            await ensureTables(env.DB);

            const existing = await env.DB.prepare(
                "SELECT username FROM users WHERE LOWER(username) = ?"
            ).bind(uKey).first();
            if (existing) {
                return new Response(JSON.stringify({ success: false, message: 'Username sudah digunakan! Silakan pilih username lain.' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        const cleanName = uKey.charAt(0).toUpperCase() + uKey.slice(1);
        const randNum = Math.floor(10 + Math.random() * 90);
        const friendCode = `${uKey.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${randNum}`;

        const avatars = ['cool', 'sakura', 'cyber', 'fox', 'cat', 'astro', 'panda', 'crown', 'gamer', 'zen'];
        const colors = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#3b82f6'];
        const assignedAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        const assignedColor = colors[Math.floor(Math.random() * colors.length)];
        const defaultLat = -6.2088 + (Math.random() - 0.5) * 0.02;
        const defaultLng = 106.8456 + (Math.random() - 0.5) * 0.02;

        if (env.DB) {
            await env.DB.prepare(`
                INSERT INTO users (username, password, name, avatar, color, friend_code, security_question, security_answer, lat, lng)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(uKey, p, cleanName, assignedAvatar, assignedColor, friendCode, securityQuestion || '', ans, defaultLat, defaultLng).run();

            // If invited by someone via Magic Invite Link, establish mutual friendship immediately
            const cleanInvitedBy = String(invitedByCode || '').trim().toUpperCase();
            if (cleanInvitedBy) {
                const inviter = await env.DB.prepare(
                    "SELECT friend_code FROM users WHERE UPPER(friend_code) = ? OR LOWER(username) = ? LIMIT 1"
                ).bind(cleanInvitedBy, cleanInvitedBy.toLowerCase()).first();

                if (inviter && inviter.friend_code && inviter.friend_code !== friendCode) {
                    await env.DB.prepare(
                        "INSERT OR IGNORE INTO friendships (user_code_a, user_code_b) VALUES (?, ?)"
                    ).bind(friendCode, inviter.friend_code).run();
                    await env.DB.prepare(
                        "INSERT OR IGNORE INTO friendships (user_code_a, user_code_b) VALUES (?, ?)"
                    ).bind(inviter.friend_code, friendCode).run();
                }
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Akun berhasil dibuat!',
            user: {
                username: uKey,
                name: cleanName,
                avatar: assignedAvatar,
                color: assignedColor,
                friendCode: friendCode,
                lat: defaultLat,
                lng: defaultLng
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: err.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
