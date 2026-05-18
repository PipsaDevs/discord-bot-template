import { type ButtonInteraction, InteractionType } from 'discord.js';
import type { InteractionHandler } from '../../interfaces/InteractionHandler.js';

const buttonHandler: InteractionHandler<ButtonInteraction> = {
	interactionType: InteractionType.MessageComponent,
	async execute(interaction) {
		if (!interaction.isButton()) {
			return;
		}
		// More to come...
	},
};

export default buttonHandler;
