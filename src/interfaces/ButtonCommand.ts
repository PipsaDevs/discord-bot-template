import type { ButtonInteraction } from 'discord.js';
import type { Client } from '../classes/Client.js';
import type { ButtonOPCodes } from '../enums/index.js';

/**
 * The structure of a button command
 */
export interface ButtonCommand {
	opcode: ButtonOPCodes;
	execute: (
		interaction: ButtonInteraction,
		client: Client,
		...args: string[]
	) => Promise<void>;
}
