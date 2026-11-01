import type { Event } from '../interfaces/Event.js';
import { Events } from 'discord.js';
import type { Interaction } from 'discord.js';
import { toError } from '../util/toError.js';

const interactionCreate: Event<[Interaction]> = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction, client) {
		const handler = client.interactionHandlers.get(interaction.type);
		const isRepliable = interaction.isRepliable();
		if (!handler) {
			if (isRepliable) {
				await interaction.reply(
					'¡Ups! Todavía no reconozco este tipo de interacción. Considera reportar este incidente a mi desarrollador.',
				);
			}
			client.emit(
				'error',
				new Error(
					`No interaction handler was found for type ${interaction.type.toString()}`,
				),
			);
			return;
		}

		try {
			await handler.execute(interaction, client);
		} catch (err) {
			const parsed = toError(err);
			client.emit('error', parsed);
			if (interaction.isRepliable()) {
				if (interaction.replied || interaction.deferred) {
					await interaction.editReply(
						'¡He tenido un error intentando ejecutar ese comando! Considera reportar este incidente a mi desarrollador.',
					);
				} else {
					await interaction.reply(
						'¡He tenido un error intentando ejecutar ese comando! Considera reportar este incidente a mi desarrollador.',
					);
				}
			}
		}
	},
};

export default interactionCreate;
