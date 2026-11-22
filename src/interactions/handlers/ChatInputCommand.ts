import { InteractionType, type ChatInputCommandInteraction } from 'discord.js';
import type { InteractionHandler } from '../../interfaces/InteractionHandler.js';
import { CommandCategory } from '../../enums/index.js';

const slashHandler: InteractionHandler<ChatInputCommandInteraction> = {
	interactionType: InteractionType.ApplicationCommand,
	async execute(interaction, client) {
		const command = client.slashCommands.get(interaction.commandName);
		if (!command) {
			client.emit(
				'error',
				new Error(
					`Command ${interaction.commandName} was not found inside Client#slashCommands collection`,
				),
			);
			await interaction.reply(
				'¡Ups! Todavía no tengo un programa para ejecutar este comando. Considera reportar este incidente a mi desarrollador.',
			);
			return;
		}
		// Initial checks: Check whether the user can run the command
		// 1st check - The command is marked for devs only
		if (
			command.category === CommandCategory.DEV &&
			!client.developers.includes(interaction.user.id)
		) {
			await interaction.reply(
				'Lo siento, pero este comando está reservado únicamente para los desarrolladores del bot.',
			);
			return;
		}

		// 2nd check - Does the bot need to be in a guild to execute that command?
		if (command.guildRequired && !interaction.guild) {
			await interaction.reply(
				'Lo siento, pero este comando necesitas ejecutarlo dentro de un servidor.',
			);
			return;
		}

		// 3rd check - Does the bot have enough permissions to execute that command?
		const inGuild = interaction.inCachedGuild();
		if (command.botPerms && inGuild) {
			const botMember = interaction.guild.members.me;
			if (botMember && !botMember.permissions.has(command.botPerms)) {
				const missing = botMember.permissions
					.missing(command.botPerms)
					.join(', ');
				await interaction.reply(
					`Lo siento, pero me hacen faltan los siguientes permisos para ejecutar el comando. Los que me faltan son: \`${missing}\``,
				);
				return;
			}
		}

		// 4th check - Does the user have enough permissions to execute that command?
		if (command.userPerms && inGuild) {
			if (!interaction.memberPermissions?.has(command.userPerms)) {
				await interaction.reply(
					'Lo siento, pero no tienes los suficientes permisos para ejecutar este comando.',
				);
				return;
			}
		}

		await command.execute(interaction, client);
	},
};

export default slashHandler;
