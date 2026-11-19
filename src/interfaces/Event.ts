import type { Client } from '../classes/Client.js';
import type { Events } from 'discord.js';

/**
 * The structure of an event
 */
export interface Event<T extends unknown[] = unknown[]> {
	name: Events;
	once: boolean;
	execute: (...args: [...T, Client]) => Promise<void>;
}
