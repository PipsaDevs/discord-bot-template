import { type ButtonInteraction, InteractionType } from 'discord.js';
import type { InteractionHandler } from '../../interfaces/InteractionHandler.js';
import ButtonOPCodes from '../../enums/ButtonOPCodes.js';

const buttonHandler: InteractionHandler<ButtonInteraction> = {
	interactionType: InteractionType.MessageComponent,
	async execute(interaction, client) {
		if (!interaction.isButton()) {
			return;
		}
		const args: string[] = interaction.customId.split('-');
		if (args[0] === '0') {
			return;
		}
		const opc = ButtonOPCodes[args[0] as keyof typeof ButtonOPCodes];
		const cmd = client.buttonCommands.get(opc);
		if (!cmd) {
			client.emit(
				'error',
				new Error(
					`OPCode ${args[0]} was not found inside Client#buttonCommands collection`,
				),
			);
			await interaction.reply(
				'¡Ups! Todavía no tengo un programa para ejecutar este botón. Considera reportar este incidente a mi desarrollador.',
			);
			return;
		}
		await cmd.execute(interaction, client, ...args);
	},
};

export default buttonHandler;
