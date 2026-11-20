import type { Interaction, InteractionType } from 'discord.js';
import type { Client } from '../classes/Client.js';

/**
 * The handler for a specified type of interaction
 */
export interface InteractionHandler<T extends Interaction = Interaction> {
	interactionType: InteractionType;
	execute: (interaction: T, client: Client) => Promise<void>;
}
