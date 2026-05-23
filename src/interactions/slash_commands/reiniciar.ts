import { SlashCommandBuilder } from 'discord.js';
import type { SlashCommand } from '../../interfaces/SlashCommand.js';
import CommandCategory from '../../enums/CommandCategory.js';

const rCmd: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('reiniciar-bot')
		.setDescription('Reinicia el bot')
		.addStringOption((opt) => {
			opt.setName('tipo')
				.setDescription('¿Qué parte del bot quieres reiniciar?')
				.addChoices(
					{
						name: 'Proceso',
						value: 'p',
					},
					{
						name: 'Cliente WebSocket',
						value: 'w',
					},
				)
				.setRequired(true);
			return opt;
		}),
	category: CommandCategory.DEV,
	async execute(interaction, client) {
		await interaction.deferReply({
			flags: ['Ephemeral'],
		});
		const target = interaction.options.getString('tipo', true);
		if (target === 'w') {
			await client.destroy();
			await client.login(process.env.DISCORD_TOKEN);
			const readyTime = client.readyTimestamp ?? Date.now();
			await interaction.editReply(
				`¡Listo! He tardado ${readyTime - interaction.createdTimestamp} ms en reiniciar mi cliente WebSocket`,
			);
		} else {
			if (process.env.PM2_HOME === undefined) {
				await interaction.editReply(
					'Lo siento, pero no estoy siendo ejecutado por PM2, así que no puedo reiniciarme de manera remota',
				);
			} else {
				await interaction.editReply(
					'¡Listo! Por favor, comprueba en unos segundos que sigo funcionando con el comando de ping',
				);
				await client.destroy();
				process.exit(0);
			}
		}
	},
};

export default rCmd;
