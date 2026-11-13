import 'dotenv/config';
import { Client } from './classes/Client.js';

const token: string | undefined =
	process.env.TESTING === '1'
		? process.env.DISCORD_TOKEN_TESTING
		: process.env.DISCORD_TOKEN;
if (!token) {
	throw new Error('Token not found in .env file');
}

const client = new Client(10000, token);

async function main() {
	await client.start();
}

void main();
