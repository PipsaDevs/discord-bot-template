/**
 * Scape a text for discord formatting
 * @param type The type of text you will be inserting, which then highlights its syntax
 * @param text The text to introduce inside the scaped block
 * @returns The formatted string ready to send to Discord
 */
export function escape(type: string, text: string): string {
	return `\`\`\`${type}\n${text}\n\`\`\``;
}
