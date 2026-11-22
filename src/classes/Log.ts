import type { LogType } from '../enums/index.js';
import type { LogInterface } from '../interfaces/index.js';

/**
 * This is the log class
 * HERE is where we finally implement both the Log type and the interface
 * It is a really basic implementation of the interface which allows to store the information of the interface and also generate a date based on the time stamp
 */
export default class Log implements LogInterface {
	type: LogType;
	timeStamp: number;
	message: string;

	/**
	 * Default Constructor
	 * @param type The type of log to store
	 * @param timeStamp The time at which the log was created
	 * @param message What does the log say?
	 */
	constructor(type: LogType, timeStamp: number, message: string) {
		this.type = type;
		this.timeStamp = timeStamp;
		this.message = message;
	}

	/**
	 * Gets the date stored from the timestamp
	 * @returns The formatted date
	 */
	generateDate(): Date {
		return new Date(this.timeStamp);
	}
}
