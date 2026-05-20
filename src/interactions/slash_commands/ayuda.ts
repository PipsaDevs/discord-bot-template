import {
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder,
	type APIEmbedField,
} from 'discord.js';
import type { SlashCommand } from '../../interfaces/SlashCommand.js';
import CommandCategory from '../../enums/CommandCategory.js';

const hCmd: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('ayuda')
		.setDescription(
			'¡Obten una lista de comandos disponibles! (o información sobre un comando)',
		)
		.addStringOption((opt) => {
			opt.setName('comando').setDescription(
				'Mira las especificaciones de algún comando en especifico',
			);
			return opt;
		}),
	category: CommandCategory.INFO,
	async execute(interaction, client) {
		const cmdStr = interaction.options.getString('comando');
		const embed = new EmbedBuilder();
		const fields: APIEmbedField[] = [];
		if (!cmdStr) {
			embed
				.setTitle('Lista de comandos disponibles')
				.setDescription(
					'¡Usa el comando con algún comando en concreto para poder ver más información sobre ese!',
				)
				.setColor('Blurple');
			for (const category in CommandCategory) {
				const val =
					CommandCategory[category as keyof typeof CommandCategory];
				const cmds = client.slashCommands
					.filter((cmd) => cmd.category === val)
					.map((c) => `\`${c.data.name}\``)
					.join(', ');
				if (cmds.length > 0) {
					fields.push({
						name: category,
						value: cmds,
					});
				}
			}
		} else {
			const cmd = client.slashCommands.get(cmdStr);
			if (!cmd) {
				await interaction.reply(
					'Parece que no tengo ese comando. Comprueba que lo has escrito bien!',
				);
				return;
			}
			fields.push(
				{ name: 'Nombre', value: `\`${cmd.data.name}\``, inline: true },
				{
					name: 'Categoría',
					value: `\`${cmd.category.toUpperCase()}\``,
					inline: true,
				},
				{ name: 'Descripción', value: `\`${cmd.data.description}\`` },
			);
			if (cmd.botPerms) {
				fields.push({
					name: 'Permisos que necesito',
					value: `\`${cmd.botPerms
						.map((c) =>
							new PermissionsBitField(c).toArray().join(', '),
						)
						.join(', ')}\``,
				});
			}
			if (cmd.userPerms) {
				fields.push({
					name: 'Permisos que necesitas',
					value: `\`${cmd.userPerms
						.map((c) =>
							new PermissionsBitField(c).toArray().join(', '),
						)
						.join(', ')}\``,
				});
			}
			if (cmd.guildRequired) {
				embed.setFooter({
					text: 'NOTA: Este comando se tiene que ejecutar dentro de un servidor',
				});
			}
			embed.setColor('Orange');
		}
		embed.addFields(fields);
		await interaction.reply({
			embeds: [embed],
		});
	},
};

export default hCmd;
