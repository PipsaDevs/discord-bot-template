import type { SlashCommand } from '../../../interfaces/SlashCommand.js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { scape } from '../../../util/scape.js';
import CommandCategory from '../../../enums/CommandCategory.js';
const pCmd: SlashCommand = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
	category: CommandCategory.INFO,
	async execute(interaction, client) {
		const sum = Date.now() - interaction.createdTimestamp;
		let wsStr: string = client.ws.ping.toString();
		if (client.ws.ping > 0) {
			wsStr = `+${wsStr}`;
		}
		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle('Pong')
			.addFields(
				{
					name: 'Websocket',
					value: scape('diff', `${wsStr} ms`),
					inline: true,
				},
				{
					name: 'Bot',
					value: scape('diff', `+${sum} ms`),
					inline: true,
				},
			)
			.setTimestamp(new Date());
		await interaction.reply({
			embeds: [embed],
		});
	},
};

export default pCmd;
