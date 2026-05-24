import 'dotenv/config';
import { Client } from './classes/Client.js';

if (!process.env.DISCORD_TOKEN) {
	throw new Error('Variable DISCORD_TOKEN has not been found in process.env');
}

const client = new Client(10000, process.env.DISCORD_TOKEN);

async function main() {
	await client.start();
}

void main();
