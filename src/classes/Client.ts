import LogType from '../enums/LogType.js';
import BoundedQueue from './BoundedQueue.js';
import Log from './Log.js';
import type { Event } from '../interfaces/Event.js';
import type { SlashCommand } from '../interfaces/SlashCommand.js';
import * as djs from 'discord.js';
import { scanDir } from '../util/scanDir.js';
import type { InteractionHandler } from '../interfaces/InteractionHandler.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import type ButtonOPCodes from '../enums/ButtonOPCodes.js';
import type { ButtonCommand } from '../interfaces/ButtonCommand.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distRoot = path.resolve(__dirname, '..');

class Client extends djs.Client {
	logs: BoundedQueue<Log>;
	interactionHandlers: djs.Collection<
		djs.InteractionType,
		InteractionHandler
	>;
	slashCommands: djs.Collection<string, SlashCommand>;
	buttonCommands: djs.Collection<ButtonOPCodes, ButtonCommand>;
	developers: string[];
	/**
	 * Instantiates an object of class Client
	 * @param logCapacity The capacity of the logs storage
	 * @param token The token of your bot
	 * @param developers An array of the ids of those whom you might consider as developers with access to developer-grade commands. If left empty, said array will be the owner(s) of the application
	 */
	constructor(logCapacity: number, token: string, developers?: string[]) {
		super({
			intents: [
				djs.GatewayIntentBits.Guilds,
				djs.GatewayIntentBits.GuildMessages,
				djs.GatewayIntentBits.MessageContent,
			],
		});
		this.logs = new BoundedQueue<Log>(logCapacity);
		this.token = token;
		this.rest = new djs.REST({ version: '10' }).setToken(this.token);
		this.interactionHandlers = new djs.Collection();
		this.slashCommands = new djs.Collection();
		this.buttonCommands = new djs.Collection();
		this.developers = developers ?? [];
	}

	/**
	 * Attaches loggers for debug, warning and events
	 */
	private attachLogger(): void {
		this.on('debug', (info: string) => {
			console.debug(`[DEBUG] => ${info}`);
			this.logs.push_back(new Log(LogType.DEBUG, Date.now(), info));
		});

		this.on('warn', (info: string) => {
			console.warn(`[WARNING] => ${info}`);
			this.logs.push_back(new Log(LogType.WARNING, Date.now(), info));
		});

		this.on('error', (err: Error) => {
			console.error(`[ERROR] => Incoming error is printed below`);
			console.error(err);
			this.logs.push_back(
				new Log(LogType.ERROR, Date.now(), err.message),
			);
		});
	}

	/**
	 * Load to a collection all files of a folder which have a default exported
	 * @param dirName The directory (assuming)
	 * @param collection The collection which will be used to store the elements
	 * @param keySelector Function to determine the key of the value
	 */
	private async loadToCollection<K, V>(
		dirName: string,
		collection: djs.Collection<K, V>,
		keySelector: (item: V) => K,
	): Promise<void> {
		const files = await scanDir(path.join(distRoot, dirName));
		for (const fpath of files) {
			const mod = await import(pathToFileURL(fpath).href);
			const def: V = mod.default as V;
			collection.set(keySelector(def), def);
		}
	}

	/**
	 * Attaches the previous loggers, loads the events and logs in the client.
	 */
	async start(): Promise<void> {
		await this.loadToCollection(
			'interactions/slash_commands',
			this.slashCommands,
			(cmd) => cmd.data.name,
		);
		await this.loadToCollection(
			'interactions/handlers',
			this.interactionHandlers,
			(handler) => handler.interactionType,
		);
		await this.loadToCollection(
			'interactions/button_commands',
			this.buttonCommands,
			(cmd) => cmd.opcode,
		);
		const eventsDir = path.join(distRoot, 'events');
		const events = await scanDir(eventsDir);
		for (const entry of events) {
			const mod = await import(pathToFileURL(entry).href);
			const event: Event = mod.default;
			if (event.once) {
				this.once(event.name.toString(), async (...args: unknown[]) => {
					await event.execute(...args, this);
				});
			} else {
				this.on(event.name.toString(), async (...args: unknown[]) => {
					await event.execute(...args, this);
				});
			}
		}
		this.attachLogger();
		await this.login();

		const app = await this.application!.fetch();
		const owner = app.owner;

		if (owner instanceof djs.User) {
			if (!this.developers.includes(owner.id)) {
				this.developers.unshift(owner.id);
			}
		} else if (owner instanceof djs.Team) {
			for (const member of owner.members.values()) {
				if (!this.developers.includes(member.id)) {
					this.developers.push(member.id);
				}
			}
		}
		for (const id of this.developers) {
			this.emit(
				'warn',
				`User with ID ${id} is now considered a developer`,
			);
		}
	}
}

export { Client };
