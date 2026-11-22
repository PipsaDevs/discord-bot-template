import * as p from '@clack/prompts';

async function main() {
	const name = await p.text({
		message: 'Introduce el directorio de instalación',
		placeholder: process.cwd(),
	});
	console.log(name);
}

void main();
