import type {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	ChatInputCommandInteraction,
	PermissionResolvable,
} from 'discord.js';
import type { Client } from '../classes/Client.js';
import type CommandCategory from '../enums/CommandCategory.js';

/**
 * Union type to define all possible slash commands data
 */
export type SlashCommandData =
	| SlashCommandBuilder
	| SlashCommandOptionsOnlyBuilder
	| SlashCommandSubcommandsOnlyBuilder;

/**
 * The structure of a slash command
 */
export interface SlashCommand {
	data: SlashCommandData;
	category: CommandCategory;
	botPerms?: PermissionResolvable[];
	userPerms?: PermissionResolvable[];
	guildRequired?: boolean;
	execute: (
		interaction: ChatInputCommandInteraction,
		client: Client,
	) => Promise<void>;
}
