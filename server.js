const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
    transports: ['polling', 'websocket']
});

const PORT = process.env.PORT || 3000;

// Body parser for JSON
app.use(express.json());

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Registered Users Database (ilprad & carrjies)
const USERS_DB = {
    'ilprad': {
        username: 'ilprad',
        password: 'map123',
        name: 'Ilprad',
        avatar: 'cyber',
        color: '#06b6d4',
        friendCode: 'ILPRAD-99',
        defaultLat: -6.2088,
        defaultLng: 106.8456
    },
    'carrjies': {
        username: 'carrjies',
        password: 'map123',
        name: 'Carrjies',
        avatar: 'fox',
        color: '#f59e0b',
        friendCode: 'CARRJIES-88',
        defaultLat: -6.2146,
        defaultLng: 106.8451
    }
};

// Store active and recent users in-memory
// userId -> { id, name, avatar, color, friendCode, lat, lng, speed, heading, battery, charging, ghostMode, stationarySince, stationaryAnchor, online, lastSeen, updatedAt }
const users = new Map();

// Friendships: friendCode -> Set of friendCodes (Mutual / Bidirectional)
const friendships = new Map();

// Pending Requests: toFriendCode -> Map of fromFriendCode -> requestData
const pendingRequests = new Map();

function areFriends(codeA, codeB) {
    if (!codeA || !codeB || codeA === codeB) return false;
    const setA = friendships.get(codeA);
    return setA ? setA.has(codeB) : false;
}

function addFriendship(codeA, codeB) {
    if (!codeA || !codeB || codeA === codeB) return;
    if (!friendships.has(codeA)) friendships.set(codeA, new Set());
    if (!friendships.has(codeB)) friendships.set(codeB, new Set());
    friendships.get(codeA).add(codeB);
    friendships.get(codeB).add(codeA);
}

// Auto-connect ilprad and carrjies as mutual friends so they see each other immediately
addFriendship('ILPRAD-99', 'CARRJIES-88');

// API Endpoint for Account Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    const uKey = String(username || '').trim().toLowerCase();
    const user = USERS_DB[uKey];

    if (!user || user.password !== String(password || '').trim()) {
        return res.status(401).json({
            success: false,
            message: 'Username atau password salah! Silakan coba lagi.'
        });
    }

    return res.json({
        success: true,
        user: {
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            color: user.color,
            friendCode: user.friendCode,
            lat: user.defaultLat,
            lng: user.defaultLng
        }
    });
});

// API Endpoint for Account Registration (Sesuai Gambar 2)
app.post('/api/register', (req, res) => {
    const { username, password, confirmPassword, securityQuestion, securityAnswer } = req.body || {};
    const uKey = String(username || '').trim().toLowerCase();
    const p = String(password || '').trim();
    const cp = String(confirmPassword || '').trim();
    const ans = String(securityAnswer || '').trim();

    if (!uKey || uKey.length < 3) {
        return res.status(400).json({ success: false, message: 'Username baru minimal 3 karakter!' });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(uKey)) {
        return res.status(400).json({ success: false, message: 'Username hanya boleh huruf, angka, underscore (_) atau strip (-)!' });
    }
    if (USERS_DB[uKey]) {
        return res.status(400).json({ success: false, message: 'Username sudah digunakan, silakan pilih username lain!' });
    }
    if (p.length < 6) {
        return res.status(400).json({ success: false, message: 'Password minimal 6 karakter!' });
    }
    if (!/[A-Z]/.test(p)) {
        return res.status(400).json({ success: false, message: 'Password harus mengandung minimal 1 huruf kapital (A-Z)!' });
    }
    if (!/[0-9]/.test(p)) {
        return res.status(400).json({ success: false, message: 'Password harus mengandung minimal 1 angka (0-9)!' });
    }
    if (p !== cp) {
        return res.status(400).json({ success: false, message: 'Konfirmasi password tidak cocok!' });
    }
    if (!ans) {
        return res.status(400).json({ success: false, message: 'Harap isi jawaban pertanyaan keamanan pemulihan!' });
    }

    const cleanName = uKey.charAt(0).toUpperCase() + uKey.slice(1);
    const randNum = Math.floor(10 + Math.random() * 90);
    const friendCode = `${uKey.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${randNum}`;

    const avatars = ['cool', 'sakura', 'cyber', 'fox', 'cat', 'astro', 'panda', 'crown', 'gamer', 'zen'];
    const colors = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#3b82f6'];
    const assignedAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const assignedColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
        username: uKey,
        password: p,
        name: cleanName,
        avatar: assignedAvatar,
        color: assignedColor,
        friendCode: friendCode,
        securityQuestion: securityQuestion || 'Apa nama hewan peliharaan pertama Anda?',
        securityAnswer: ans,
        defaultLat: -6.2088 + (Math.random() - 0.5) * 0.02,
        defaultLng: 106.8456 + (Math.random() - 0.5) * 0.02
    };

    USERS_DB[uKey] = newUser;

    // Auto friend new user with default accounts so they have friends immediately
    addFriendship(friendCode, 'ILPRAD-99');
    addFriendship(friendCode, 'CARRJIES-88');

    return res.json({
        success: true,
        message: 'Akun berhasil dibuat!',
        user: {
            username: newUser.username,
            password: newUser.password,
            name: newUser.name,
            avatar: newUser.avatar,
            color: newUser.color,
            friendCode: newUser.friendCode,
            lat: newUser.defaultLat,
            lng: newUser.defaultLng
        }
    });
});

function removeFriendship(codeA, codeB) {
    if (!codeA || !codeB) return;
    if (friendships.has(codeA)) friendships.get(codeA).delete(codeB);
    if (friendships.has(codeB)) friendships.get(codeB).delete(codeA);
}

function getFriendsOf(code) {
    const friends = [];
    const friendSet = friendships.get(code);
    if (!friendSet) return friends;
    for (const fCode of friendSet) {
        for (const u of users.values()) {
            if (u.friendCode === fCode) {
                friends.push(u);
                break;
            }
        }
    }
    return friends;
}

function getPendingRequestsFor(code) {
    const reqs = pendingRequests.get(code);
    if (!reqs) return [];
    return Array.from(reqs.values());
}

// Helper to calculate distance in meters (Haversine)
function getDistanceMeters(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
    const R = 6371e3; // meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Generate friend code: [NAMA]-[2 ANGKA] (misal: AMEL-24, ILPRAD-07)
function generateFriendCode(name) {
    const cleanName = (name || 'USER')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 8) || 'USER';
    const num = Math.floor(10 + Math.random() * 90); // 2 digit number: 10 - 99
    return `${cleanName}-${num}`;
}

// Helper to blur coordinates if ghost mode is active (~500m offset)
function applyGhostOffset(lat, lng) {
    const latOffset = (Math.random() - 0.5) * 0.008;
    const lngOffset = (Math.random() - 0.5) * 0.008;
    return {
        lat: lat + latOffset,
        lng: lng + lngOffset
    };
}

io.on('connection', (socket) => {
    console.log(`[+] User connected: ${socket.id}`);

    // Send currently online users to the new connection
    socket.emit('init-users', Array.from(users.values()));

    // User joins with profile
    socket.on('join', (profile) => {
        const validCodeRegex = /^[A-Z0-9]{2,10}-\d{2}$/i;
        let friendCode = (profile.friendCode && validCodeRegex.test(profile.friendCode))
            ? profile.friendCode.toUpperCase()
            : generateFriendCode(profile.name);

        const lat = profile.lat || null;
        const lng = profile.lng || null;
        const now = Date.now();

        const userData = {
            id: socket.id,
            name: profile.name || 'Friend',
            avatar: profile.avatar || '😎',
            color: profile.color || '#3b82f6',
            friendCode: friendCode,
            lat: lat,
            lng: lng,
            speed: 0,
            heading: 0,
            accuracy: profile.accuracy ?? null,
            battery: profile.battery ?? 100,
            charging: profile.charging ?? false,
            ghostMode: profile.ghostMode ?? false,
            stationarySince: now,
            stationaryAnchor: lat && lng ? { lat, lng } : null,
            online: true,
            lastSeen: null,
            updatedAt: now
        };

        users.set(socket.id, userData);

        // If joined via Magic Invite Link, establish mutual friendship immediately
        if (profile.invitedByCode) {
            const cleanInviter = String(profile.invitedByCode).trim().toUpperCase();
            if (cleanInviter && cleanInviter !== userData.friendCode) {
                addFriendship(userData.friendCode, cleanInviter);
                // Check if inviter is currently online and notify them
                for (const [sId, u] of users.entries()) {
                    if (u.friendCode === cleanInviter) {
                        io.to(sId).emit('friend-request-accepted', { friend: userData });
                        break;
                    }
                }
                console.log(`[Magic Invite via Join] ${userData.name} [${userData.friendCode}] <-> ${cleanInviter}`);
            }
        }

        // Send confirmation back to user with assigned friendCode
        socket.emit('join-confirmed', {
            id: socket.id,
            friendCode: userData.friendCode,
            stationarySince: userData.stationarySince
        });

        // Send confirmed friends and pending requests for this user
        socket.emit('init-friends-data', {
            friends: getFriendsOf(userData.friendCode),
            requests: getPendingRequestsFor(userData.friendCode)
        });

        io.emit('user-joined', userData);
        console.log(`[User Joined] ${userData.name} [${userData.friendCode}] (${socket.id})`);
    });

    // Update location and status
    socket.on('update-location', (data) => {
        const user = users.get(socket.id);
        if (!user) return;

        let displayLat = data.lat;
        let displayLng = data.lng;

        // Apply ghost blur if ghost mode is enabled
        if (data.ghostMode) {
            const blurred = applyGhostOffset(data.lat, data.lng);
            displayLat = blurred.lat;
            displayLng = blurred.lng;
        }

        const now = Date.now();
        const currentSpeed = data.speed || 0; // km/h

        // Dwell Time Logic:
        // Jika user belum punya anchor atau berpindah > 50 meter / kecepatan tinggi, reset stationary timer
        if (!user.stationaryAnchor && displayLat && displayLng) {
            user.stationaryAnchor = { lat: displayLat, lng: displayLng };
            user.stationarySince = now;
        } else if (user.stationaryAnchor && displayLat && displayLng) {
            const distFromAnchor = getDistanceMeters(
                user.stationaryAnchor.lat, user.stationaryAnchor.lng,
                displayLat, displayLng
            );
            if (distFromAnchor > 50 || currentSpeed > 5) {
                user.stationaryAnchor = { lat: displayLat, lng: displayLng };
                user.stationarySince = now;
            }
        }

        user.lat = displayLat;
        user.lng = displayLng;
        user.rawLat = data.lat;
        user.rawLng = data.lng;
        user.accuracy = data.accuracy || null;
        user.speed = currentSpeed;
        user.heading = data.heading || 0;
        user.battery = data.battery ?? user.battery;
        user.charging = data.charging ?? user.charging;
        user.ghostMode = !!data.ghostMode;
        user.online = true;
        user.updatedAt = now;

        // Broadcast to all clients
        io.emit('location-updated', {
            id: socket.id,
            lat: user.lat,
            lng: user.lng,
            accuracy: user.accuracy,
            speed: user.speed,
            heading: user.heading,
            battery: user.battery,
            charging: user.charging,
            ghostMode: user.ghostMode,
            stationarySince: user.stationarySince,
            online: true,
            updatedAt: user.updatedAt
        });
    });

    // Update Profile (Nama/Username kustom, Avatar, Warna, Friend Code)
    socket.on('update-profile', (newProfile) => {
        const user = users.get(socket.id);
        if (!user) return;

        if (newProfile.name) {
            user.name = newProfile.name.trim().slice(0, 25);
        }
        if (newProfile.avatar) {
            user.avatar = newProfile.avatar;
        }
        if (newProfile.color) {
            user.color = newProfile.color;
        }
        if (newProfile.friendCode) {
            user.friendCode = newProfile.friendCode.toUpperCase();
        } else if (newProfile.name) {
            user.friendCode = generateFriendCode(user.name);
        }
        user.updatedAt = Date.now();

        // Broadcast profile baru ke semua client
        io.emit('user-profile-updated', {
            id: socket.id,
            name: user.name,
            avatar: user.avatar,
            color: user.color,
            friendCode: user.friendCode
        });

        console.log(`[Profile Updated] ${user.name} [${user.friendCode}] (${socket.id})`);
    });

    // Search friend by Friend Code [NAMA]-[2 ANGKA]
    socket.on('search-friend-by-code', (code, callback) => {
        const sender = users.get(socket.id);
        const clean = (code || '').trim().toUpperCase();
        if (sender && sender.friendCode === clean) {
            if (typeof callback === 'function') callback({ success: false, message: 'Ini adalah kode teman Anda sendiri!' });
            return;
        }
        let found = null;
        for (const u of users.values()) {
            if (u.friendCode === clean) {
                found = {
                    id: u.id,
                    name: u.name,
                    avatar: u.avatar,
                    color: u.color,
                    friendCode: u.friendCode,
                    lat: u.lat,
                    lng: u.lng,
                    online: u.online !== false,
                    lastSeen: u.lastSeen,
                    stationarySince: u.stationarySince
                };
                break;
            }
        }
        if (found) {
            const isFriend = sender ? areFriends(sender.friendCode, found.friendCode) : false;
            const hasPending = (sender && pendingRequests.has(found.friendCode) && pendingRequests.get(found.friendCode).has(sender.friendCode));
            if (typeof callback === 'function') {
                callback({ success: true, user: found, isFriend, isPending: hasPending });
            }
        } else {
            if (typeof callback === 'function') {
                callback({ success: false, message: `Pengguna dengan kode ${clean} tidak ditemukan.` });
            }
        }
    });

    // Get Inviter Public Info for Magic Invite Preview
    socket.on('get-invite-info', (code, callback) => {
        const clean = (code || '').trim().toUpperCase();
        let found = null;
        for (const u of users.values()) {
            if (u.friendCode === clean) {
                found = {
                    name: u.name,
                    avatar: u.avatar,
                    color: u.color,
                    friendCode: u.friendCode,
                    online: u.online !== false
                };
                break;
            }
        }
        if (typeof callback === 'function') {
            callback(found ? { success: true, user: found } : { success: false, message: 'Pengundang tidak ditemukan atau sedang offline.' });
        }
    });

    // Accept Magic Invite (Instant 1-Click Mutual Friendship)
    socket.on('accept-magic-invite', ({ targetCode }, callback) => {
        const me = users.get(socket.id);
        if (!me) {
            if (typeof callback === 'function') callback({ success: false, message: 'Sesi tidak valid.' });
            return;
        }
        const cleanTarget = (targetCode || '').trim().toUpperCase();
        if (me.friendCode === cleanTarget) {
            if (typeof callback === 'function') callback({ success: false, message: 'Ini adalah kode teman Anda sendiri.' });
            return;
        }

        // Establish mutual friendship
        addFriendship(me.friendCode, cleanTarget);

        // Clear any pending requests between the two
        if (pendingRequests.has(me.friendCode)) {
            pendingRequests.get(me.friendCode).delete(cleanTarget);
        }
        if (pendingRequests.has(cleanTarget)) {
            pendingRequests.get(cleanTarget).delete(me.friendCode);
        }

        let targetUser = null;
        let targetSocketId = null;
        for (const [sId, u] of users.entries()) {
            if (u.friendCode === cleanTarget) {
                targetUser = u;
                targetSocketId = sId;
                break;
            }
        }

        // Notify both sockets in realtime
        if (targetUser) {
            socket.emit('friend-request-accepted', { friend: targetUser });
        }
        if (targetSocketId && io.sockets.sockets.get(targetSocketId)) {
            io.to(targetSocketId).emit('friend-request-accepted', { friend: me });
        }

        console.log(`[Magic Invite Connected] ${me.name} [${me.friendCode}] <-> ${cleanTarget}`);
        if (typeof callback === 'function') {
            callback({ success: true, friend: targetUser });
        }
    });

    // Kirim Permintaan Pertemanan (Send Friend Request)
    socket.on('send-friend-request', ({ targetCode }, callback) => {
        const sender = users.get(socket.id);
        if (!sender) return;
        const cleanTarget = (targetCode || '').trim().toUpperCase();

        if (sender.friendCode === cleanTarget) {
            if (typeof callback === 'function') callback({ success: false, message: 'Tidak dapat menambahkan diri sendiri.' });
            return;
        }

        let targetUser = null;
        let targetSocketId = null;
        for (const [sId, u] of users.entries()) {
            if (u.friendCode === cleanTarget) {
                targetUser = u;
                targetSocketId = sId;
                break;
            }
        }

        if (!targetUser) {
            if (typeof callback === 'function') callback({ success: false, message: 'Pengguna tujuan tidak ditemukan.' });
            return;
        }

        if (areFriends(sender.friendCode, targetUser.friendCode)) {
            if (typeof callback === 'function') callback({ success: false, message: `Anda sudah berteman dengan ${targetUser.name}!` });
            return;
        }

        if (!pendingRequests.has(targetUser.friendCode)) {
            pendingRequests.set(targetUser.friendCode, new Map());
        }

        const reqData = {
            fromId: socket.id,
            fromCode: sender.friendCode,
            fromName: sender.name,
            fromAvatar: sender.avatar,
            fromColor: sender.color,
            toCode: targetUser.friendCode,
            timestamp: Date.now()
        };

        pendingRequests.get(targetUser.friendCode).set(sender.friendCode, reqData);

        // Kirim notifikasi ke socket tujuan jika sedang online
        if (targetSocketId && io.sockets.sockets.get(targetSocketId)) {
            io.to(targetSocketId).emit('friend-request-received', reqData);
        }

        console.log(`[Friend Request] ${sender.name} [${sender.friendCode}] -> ${targetUser.name} [${targetUser.friendCode}]`);

        if (typeof callback === 'function') {
            callback({ success: true, message: `Permintaan pertemanan terkirim ke ${targetUser.name}!` });
        }
    });

    // Terima Permintaan Pertemanan (Accept Friend Request)
    socket.on('accept-friend-request', ({ fromCode }, callback) => {
        const me = users.get(socket.id);
        if (!me) return;
        const reqs = pendingRequests.get(me.friendCode);
        if (!reqs || !reqs.has(fromCode)) {
            if (typeof callback === 'function') callback({ success: false, message: 'Permintaan tidak ditemukan.' });
            return;
        }

        reqs.delete(fromCode);
        addFriendship(me.friendCode, fromCode);

        let otherUser = null;
        let otherSocketId = null;
        for (const [sId, u] of users.entries()) {
            if (u.friendCode === fromCode) {
                otherUser = u;
                otherSocketId = sId;
                break;
            }
        }

        // Kirim event mutual ke kedua pihak
        if (otherUser) {
            socket.emit('friend-request-accepted', { friend: otherUser });
        }
        if (otherSocketId && io.sockets.sockets.get(otherSocketId)) {
            io.to(otherSocketId).emit('friend-request-accepted', { friend: me });
        }

        console.log(`[Friend Accepted] ${me.name} menerima pertemanan dari ${fromCode}`);

        if (typeof callback === 'function') {
            callback({ success: true, friend: otherUser });
        }
    });

    // Tolak Permintaan Pertemanan (Reject Friend Request)
    socket.on('reject-friend-request', ({ fromCode }, callback) => {
        const me = users.get(socket.id);
        if (!me) return;
        const reqs = pendingRequests.get(me.friendCode);
        if (reqs) {
            reqs.delete(fromCode);
        }
        console.log(`[Friend Rejected] ${me.name} menolak pertemanan dari ${fromCode}`);
        if (typeof callback === 'function') callback({ success: true });
    });

    // Hapus Teman (Remove Friend)
    socket.on('remove-friend', ({ friendCode }, callback) => {
        const me = users.get(socket.id);
        if (!me) return;
        removeFriendship(me.friendCode, friendCode);

        // Beritahu teman yang dihapus jika sedang online
        for (const [sId, u] of users.entries()) {
            if (u.friendCode === friendCode) {
                io.to(sId).emit('friend-removed', { friendCode: me.friendCode, friendName: me.name });
                break;
            }
        }

        socket.emit('friend-removed', { friendCode, friendName: friendCode });
        console.log(`[Friend Removed] ${me.name} menghapus pertemanan dengan ${friendCode}`);
        if (typeof callback === 'function') callback({ success: true });
    });

    // Send emoji reaction to a friend
    socket.on('send-reaction', (reaction) => {
        const sender = users.get(socket.id);
        io.emit('reaction-received', {
            senderId: socket.id,
            senderName: sender ? sender.name : 'Teman',
            targetId: reaction.targetId,
            emoji: reaction.emoji || '❤️'
        });
    });

    // OTW (On The Way) Navigation Handlers
    socket.on('start-otw', (otwData) => {
        // otwData: { fromId, fromName, fromAvatar, toId, toName, distanceKm, etaMinutes, routeCoords }
        io.emit('otw-started', otwData);
        console.log(`[OTW] ${otwData.fromName} sedang OTW ke ${otwData.toName} (${otwData.distanceKm} km, ETA: ${otwData.etaMinutes} mnt)`);
    });

    socket.on('cancel-otw', (data) => {
        io.emit('otw-cancelled', data);
    });

    socket.on('arrive-otw', (data) => {
        io.emit('otw-arrived', data);
    });

    // Meetup Invitation Handlers
    socket.on('send-meetup-invite', (inviteData) => {
        // inviteData: { id, fromId, fromName, fromAvatar, toId, toName, placeName, lat, lng, note }
        io.emit('meetup-invite-received', inviteData);
        console.log(`[Meetup Invite] Dari ${inviteData.fromName} ke ${inviteData.toName} di ${inviteData.placeName}`);
    });

    socket.on('respond-meetup-invite', (responseData) => {
        // responseData: { inviteId, fromId, fromName, toId, toName, accepted, lat, lng, placeName }
        io.emit('meetup-response-received', responseData);
        console.log(`[Meetup Response] ${responseData.fromName} ${responseData.accepted ? 'MENERIMA' : 'MENOLAK'} ajakan`);
    });

    // Real-time Chat Handlers (Personal & Group)
    socket.on('send-chat', (chatData) => {
        // chatData: { id, senderId, senderName, senderAvatar, targetId, text, type, location, timestamp }
        io.emit('chat-received', chatData);
        console.log(`[Chat] ${chatData.senderName} (${chatData.targetId ? 'Pribadi' : 'Grup'}): ${chatData.text}`);
    });

    // Handle mock friend location update
    socket.on('mock-location-update', (mockData) => {
        const user = users.get(mockData.id);
        if (user) {
            user.lat = mockData.lat;
            user.lng = mockData.lng;
            user.speed = mockData.speed || 0;
            user.heading = mockData.heading || 0;
            user.battery = mockData.battery;
            user.updatedAt = Date.now();
            if (!user.stationarySince) {
                user.stationarySince = Date.now() - (25 * 60 * 1000); // 25 mnt di sini
            }

            io.emit('location-updated', {
                id: user.id,
                lat: user.lat,
                lng: user.lng,
                speed: user.speed,
                heading: user.heading,
                battery: user.battery,
                charging: user.charging,
                ghostMode: user.ghostMode,
                stationarySince: user.stationarySince,
                online: true,
                updatedAt: user.updatedAt
            });
        }
    });

    // Handle bot / simulation friend added from client
    socket.on('add-mock-friend', (mockData) => {
        const mockId = 'mock-' + Math.random().toString(36).substring(2, 9);
        const botName = mockData.name || 'Bot';
        const mockUser = {
            id: mockId,
            name: botName,
            avatar: mockData.avatar || '🤖',
            color: mockData.color || '#ec4899',
            friendCode: generateFriendCode(botName),
            lat: mockData.lat,
            lng: mockData.lng,
            speed: mockData.speed || 0,
            heading: mockData.heading || 45,
            battery: mockData.battery || 88,
            charging: false,
            ghostMode: false,
            stationarySince: Date.now() - (Math.floor(Math.random() * 80) + 15) * 60 * 1000, // 15-95 mnt lalu
            stationaryAnchor: { lat: mockData.lat, lng: mockData.lng },
            online: true,
            lastSeen: null,
            isMock: true,
            updatedAt: Date.now()
        };
        users.set(mockId, mockUser);
        const creator = users.get(socket.id);
        if (creator) {
            addFriendship(creator.friendCode, mockUser.friendCode);
        }
        io.emit('user-joined', mockUser);
        socket.emit('friend-request-accepted', { friend: mockUser });
    });

    // Disconnect: keep user state with online=false and lastSeen timestamp
    socket.on('disconnect', () => {
        console.log(`[-] User disconnected: ${socket.id}`);
        const user = users.get(socket.id);
        if (user) {
            user.online = false;
            user.lastSeen = Date.now();
            io.emit('user-offline', {
                id: socket.id,
                name: user.name,
                avatar: user.avatar,
                color: user.color,
                friendCode: user.friendCode,
                lat: user.lat,
                lng: user.lng,
                lastSeen: user.lastSeen,
                stationarySince: user.stationarySince
            });
        }
    });
});

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

if (!process.env.VERCEL) {
    server.listen(PORT, '0.0.0.0', () => {
        const localIP = getLocalIP();
        console.log(`=======================================================`);
        console.log(`🚀 Zenly Clone Server berjalan!`);
        console.log(`📍 Local:   http://localhost:${PORT}`);
        console.log(`📱 Di HP:   http://${localIP}:${PORT} (Satu Wi-Fi)`);
        console.log(`=======================================================`);
    });
}

module.exports = (req, res) => {
    server.emit('request', req, res);
};
