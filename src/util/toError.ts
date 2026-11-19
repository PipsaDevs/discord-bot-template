/**
 * Format an error parameter to an actual error class
 * @param value The error parameter with unknown type
 * @returns A typed Error
 */
export function toError(value: unknown): Error {
	if (value instanceof Error) {
		return value;
	}
	try {
		return new Error(JSON.stringify(value));
	} catch {
		return new Error(String(value));
	}
}
