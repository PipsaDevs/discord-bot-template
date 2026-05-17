import { readdir } from 'fs/promises';

async function scanDir(baseDir: string): Promise<string[]> {
	const result: string[] = [];
	const entries = await readdir(baseDir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = `${baseDir}/${entry.name}`;
		if (entry.isDirectory()) {
			result.push(...(await scanDir(fullPath)));
		} else if (entry.name.endsWith('.js')) {
			result.push(fullPath);
		}
	}
	return result;
}

export { scanDir };
