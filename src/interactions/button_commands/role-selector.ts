import type { ButtonCommand } from '../../interfaces/ButtonCommand.js';
import ButtonOPCodes from '../../enums/ButtonOPCodes.js';
import type { GuildMemberRoleManager } from 'discord.js';

const rCmd: ButtonCommand = {
	opcode: ButtonOPCodes.giveRole,
	async execute(interaction, _client, _opc, roleId) {
		if (!interaction.member) {
			console.error(
				'error',
				new Error('Interaction#member is undefined'),
			);
			await interaction.reply(
				'¡Hola! Por alguna razón, me sale que no has ejecutado este botón dentro de un servidor. Considera reportar este incidente a mi desarrollador',
			);
			return;
		}
		const roleManager = interaction.member.roles as GuildMemberRoleManager;
		if (roleManager.cache.has(roleId)) {
			await roleManager.remove(roleId);
			await interaction.reply({
				content: `¡Listo! Ya no tienes el rol <@&${roleId}>`,
				flags: ['Ephemeral'],
			});
		} else {
			await roleManager.add(roleId);
			await interaction.reply({
				content: `¡Listo! Ya tienes el rol <@&${roleId}>`,
				flags: ['Ephemeral'],
			});
		}
	},
};

export default rCmd;
