/**
 * Verification-only stand-in for the Supabase endpoints Group Play calls.
 * Anonymous auth and join RPCs are answered from fixtures; every other path
 * is forwarded to the repo's own mock (tests/mocks/supabase-posts.mjs), which
 * serves posts and teaching ideas. Realtime is not faked, so a successful join
 * (which opens a websocket) is out of scope. Every RPC call is logged.
 */
import { createServer } from 'node:http';
import { appendFileSync } from 'node:fs';

const PORT = Number(process.env.VERIFY_FAKE_PORT);
const MOCK = Number(process.env.VERIFY_MOCK_PORT);
const LOG = `${process.env.VERIFY_EVIDENCE}/rpc-calls.jsonl`;

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const NOW = () => Math.floor(Date.now() / 1000);
const USER = {
	id: '00000000-0000-4000-8000-000000000001',
	aud: 'authenticated',
	role: 'authenticated',
	is_anonymous: true
};

const CLASS_ROOM = {
	has_class: true,
	room_code: 'CLAZ',
	status: 'lobby',
	class_id: 'fixture-class',
	class_name: 'Fixture Seminary Class',
	require_claim_codes: false,
	seats: [
		{ id: 's1', display_name: 'Ada Fixture', is_claimed: false, sort_order: 1 },
		{ id: 's2', display_name: 'Ben Fixture', is_claimed: true, sort_order: 2 }
	]
};

function rpc(name, body) {
	const code = body.p_code;
	if (code === 'ZZZZ') return [400, { message: 'ROOM_NOT_FOUND' }];
	if (code === 'ENDD') return [400, { message: 'ROOM_ENDED' }];
	if (name === 'get_room_join_info') {
		return [
			200,
			code === 'CLAZ'
				? CLASS_ROOM
				: { has_class: false, room_code: code, status: 'lobby', seats: [] }
		];
	}
	if (name === 'join_room' && body.p_seat_id === 's2')
		return [400, { message: 'SEAT_ALREADY_CLAIMED' }];
	return [400, { message: `fixture has no answer for ${name}` }];
}

createServer(async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		req.headers['access-control-request-headers'] ?? '*'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	if (req.method === 'OPTIONS') return res.writeHead(204).end();
	if (req.url === '/health') return res.writeHead(200).end('ok');

	const chunks = [];
	for await (const c of req) chunks.push(c);
	const raw = Buffer.concat(chunks);
	const json = (status, obj) =>
		res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(obj));

	if (req.method === 'POST' && req.url.startsWith('/auth/v1/signup')) {
		const token = `${b64({ alg: 'none' })}.${b64({ sub: USER.id, role: 'authenticated', exp: NOW() + 3600 })}.x`;
		return json(200, {
			access_token: token,
			token_type: 'bearer',
			expires_in: 3600,
			expires_at: NOW() + 3600,
			refresh_token: 'fixture-refresh',
			user: USER
		});
	}
	const m = req.url.match(/^\/rest\/v1\/rpc\/(\w+)/);
	if (req.method === 'POST' && m) {
		const body = JSON.parse(raw.toString() || '{}');
		const [status, out] = rpc(m[1], body);
		appendFileSync(LOG, JSON.stringify({ rpc: m[1], body, status }) + '\n');
		return json(status, out);
	}
	const up = await fetch(`http://127.0.0.1:${MOCK}${req.url}`, {
		method: req.method,
		body: ['GET', 'HEAD'].includes(req.method) ? undefined : raw
	});
	res.writeHead(up.status, {
		'Content-Type': up.headers.get('content-type') ?? 'text/plain'
	}).end(Buffer.from(await up.arrayBuffer()));
}).listen(PORT, '127.0.0.1', () => console.log(`[verify-fake-supabase] :${PORT} -> mock :${MOCK}`));
