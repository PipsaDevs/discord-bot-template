import { readdir } from 'fs/promises';

/**
 * Function to recursively scan a specified directory
 * @param baseDir The base directory to be scanned
 * @returns An array of strings containing the path to every file scanned which ends with js or ts
 */
export async function scanDir(baseDir: string): Promise<string[]> {
	const result: string[] = [];
	const entries = await readdir(baseDir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = `${baseDir}/${entry.name}`;
		if (entry.isDirectory()) {
			result.push(...(await scanDir(fullPath)));
		} else if (entry.name.endsWith('.js') || entry.name.endsWith('ts')) {
			result.push(fullPath);
		}
	}
	return result;
}
