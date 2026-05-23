import {
	ButtonStyle,
	type GuildMemberRoleManager,
	PermissionFlagsBits,
} from 'discord.js';
import CommandCategory from '../../../enums/CommandCategory.js';
import type { SlashCommand } from '../../../interfaces/SlashCommand.js';
import {
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder,
} from '@discordjs/builders';
import ButtonOPCodes from '../../../enums/ButtonOPCodes.js';

const rCmd: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('selector-de-roles')
		.setDescription(
			'Genera un botón que permite a los usuarios del servidor añadirse/quitarse el rol.',
		)
		.addRoleOption((opt) => {
			opt.setName('rol').setDescription('El rol a dar').setRequired(true);
			return opt;
		}),
	category: CommandCategory.MOD,
	botPerms: [PermissionFlagsBits.ManageRoles],
	userPerms: [PermissionFlagsBits.ManageRoles],
	guildRequired: true,
	async execute(interaction, client) {
		if (!(interaction.guild && interaction.member)) {
			return;
		}
		const role = interaction.options.getRole('rol', true);
		const memberRoleManager = interaction.member
			.roles as GuildMemberRoleManager;
		const clientMember = await interaction.guild.members.fetch(
			client.user!.id,
		);
		if (role.position >= memberRoleManager.highest.position) {
			await interaction.reply({
				content:
					'¡Hola! Para ejecutar ese comando, necesitas que tu rol más alto esté por encima del rol que quieres dar.',
				flags: ['Ephemeral'],
			});
			return;
		}
		if (role.position >= clientMember.roles.highest.position) {
			await interaction.reply({
				content:
					'¡Hola! Para ejecutar ese comando, necesito un rol que esté por encima del rol que quieres dar.',
				flags: ['Ephemeral'],
			});
			return;
		}
		const button = new ButtonBuilder()
			.setCustomId(ButtonOPCodes.giveRole + '-' + role.id)
			.setLabel('Añadir/quitar rol')
			.setStyle(ButtonStyle.Primary);
		await interaction.reply({
			content: `¡Usa este botón para conseguir el rol <@&${role.id}>!`,
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(button),
			],
		});
	},
};

export default rCmd;
