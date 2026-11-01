import 'dotenv/config';
import { Client } from './classes/Client.js';
import { Routes } from 'discord.js';
import type { APIUser } from 'discord.js';

if (!process.env.DISCORD_TOKEN) {
	throw new Error('Variable DISCORD_TOKEN has not been found in process.env');
}

const client = new Client(50, process.env.DISCORD_TOKEN);

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
