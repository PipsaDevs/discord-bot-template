import 'dotenv/config';
import { Client } from './classes/Client.js';
import { Routes } from 'discord.js';
import type { APIUser } from 'discord.js';

const token: string | undefined =
	process.env.TESTING === '1'
		? process.env.DISCORD_TOKEN_TESTING
		: process.env.DISCORD_TOKEN;
if (!token) {
	throw new Error('Token not found in .env');
}
const client = new Client(50, token);

/**
 * Initializes the essential parts of the client to push the command data to the Discord Rest API
 */
async function main() {
	await client.loadAll();
	const usr = (await client.rest.get(Routes.user('@me'))) as APIUser;
	const id =
		usr.id ||
		Buffer.from(client.token!.split('.')[0]!, 'base64').toString('utf-8');
	const r = await client.rest.put(Routes.applicationCommands(id), {
		body: client.slashCommands.map((c) => c.data.toJSON()),
	});
	console.log(r);
	process.exit(0);
}

void main();
