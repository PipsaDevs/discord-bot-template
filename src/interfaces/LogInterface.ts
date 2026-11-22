import type { LogType } from '../enums/index.js';

/**
 * What does a log look like?
 * This is what we define here
 */
export interface LogInterface {
	type: LogType;
	timeStamp: number;
	message: string;
}
