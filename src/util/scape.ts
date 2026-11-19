/**
 * Scape a text for discord formatting
 * @param type The type of text you will be inserting, which then highlights its syntax
 * @param text The text to introduce inside the scaped block
 * @returns The formatted string ready to send to Discord
 */
const scape = (type: string, text: string) => {
	return `\`\`\`${type}\n${text}\n\`\`\``;
};
export { scape };
