import type { Event } from '../interfaces/index.js';
import { Events } from 'discord.js';

const clientReady: Event<[]> = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.emit(
			'debug',
			`Ready, logged in as ${client?.user?.tag ?? 'null'} at ${client.readyAt}`,
		);
		client.emit('debug', `Loaded ${client.slashCommands.size} commands`);
	},
};

export default clientReady;
