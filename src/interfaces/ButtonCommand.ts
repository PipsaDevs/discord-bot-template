import type { ButtonInteraction } from 'discord.js';
import type { Client } from '../classes/Client.js';
import type ButtonOPCodes from '../enums/ButtonOPCodes.js';

export interface ButtonCommand {
	opcode: ButtonOPCodes;
	execute: (
		client: Client,
		interaction: ButtonInteraction,
		...args: string[]
	) => Promise<void>;
}
