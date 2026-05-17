import 'dotenv/config';
import { Client } from './classes/Client.js';
import { Routes } from 'discord.js';

if (!process.env.DISCORD_TOKEN) {
	throw new Error('Variable DISCORD_TOKEN has not been found in process.env');
}

const client = new Client(50, process.env.DISCORD_TOKEN);

async function main() {
	await client.start();
	if (!client.user) {
		throw new Error('Client#user is null');
	}
	const r = await client.rest.put(
		Routes.applicationCommands(client.user.id),
		{
			body: client.slashCommands.map((c) => c.data.toJSON()),
		},
	);
	console.log(r);
	process.exit(0);
}

void main();
