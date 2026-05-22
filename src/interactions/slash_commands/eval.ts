import {
	AttachmentBuilder,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
import type { SlashCommand } from '../../interfaces/SlashCommand.js';
import CommandCategory from '../../enums/CommandCategory.js';
import { transpile } from 'typescript';
import { inspect } from 'node:util';
import { toError } from '../../util/toError.js';
import { scape } from '../../util/scape.js';
const hCmd: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Evalua una expresión y devuelve el resultado.')
		.addStringOption((opt) => {
			opt.setName('expresión')
				.setDescription('La expresión a evaluar')
				.setRequired(true);
			return opt;
		})
		.addBooleanOption((opt) => {
			opt.setName('invisible')
				.setDescription('¿Quieres que el output sea invisible?')
				.setRequired(true);
			return opt;
		})
		.addBooleanOption((opt) => {
			opt.setName('asíncrono').setDescription(
				'¿Quieres correr el código dentro de una función asíncrona?',
			);
			return opt;
		})
		.addStringOption((opt) => {
			opt.setName('lenguaje')
				.setDescription('¿En qué lenguaje quieres evaluar el código?')
				.addChoices(
					{ name: 'TypeScript', value: 'ts' },
					{ name: 'JavaScript', value: 'js' },
				);
			return opt;
		})
		.addNumberOption((opt) => {
			opt.setName('profundidad').setDescription(
				'La profundidad de la respuesta',
			);
			return opt;
		}),
	category: CommandCategory.DEV,
	async execute(interaction, _client) {
		// Get the options
		const expression = interaction.options.getString('expresión', true);
		const ephem = interaction.options.getBoolean('invisible', true);
		const asynceval = interaction.options.getBoolean('asíncrono') ?? false;
		const lang = interaction.options.getString('lenguaje') ?? 'ts';
		const dep = interaction.options.getNumber('profundidad') ?? null;

		// Control variables
		const isTs = lang === 'ts';
		const wasExpModified = isTs || asynceval;
		let success = true;
		let output: string;

		// Firstly, we deferr the reply
		await interaction.deferReply({
			flags: ephem ? ['Ephemeral'] : [],
		});

		// Now, we begin to manipulate the expression to evaluate it
		let convertedExpression = expression;
		if (asynceval) {
			convertedExpression = `(async () => {${convertedExpression}})()`;
		}

		// Now, we begin to evaluate the expression
		try {
			if (isTs) {
				convertedExpression = transpile(convertedExpression);
			}
			const evalued = asynceval
				? await eval(convertedExpression)
				: eval(convertedExpression);
			output = inspect(evalued, { depth: dep });
		} catch (err) {
			success = false;
			output = toError(err).message;
		}

		// Now, we start to build the response
		// Firstly, let's start by building temporary files which will allow us to not crash if we surpass the 1024 character limit for fields
		// At the same time, we'll build the embed
		const cutFiles: AttachmentBuilder[] = [];
		const embed = new EmbedBuilder();
		let embeddedExpression = scape(lang, expression);
		let embeddedOutput = scape(lang, output);

		if (embeddedExpression.length > 1024) {
			const fname = `expression.${lang}`;
			embeddedExpression = scape(
				'',
				`La expresión se encuentra en el archivo adjunto ${fname}`,
			);
			const buffer = Buffer.from(expression);
			cutFiles.push(new AttachmentBuilder(buffer, { name: fname }));
		}
		embed.addFields({
			name: 'Expresión original',
			value: embeddedExpression,
		});
		if (wasExpModified) {
			let embeddedModified = scape('js', convertedExpression);
			if (embeddedModified.length > 1024) {
				const fname = 'converted.js';
				embeddedModified = scape(
					'',
					`La expresión convertida se encuentra en el archivo adjunto ${fname}`,
				);
				const buffer = Buffer.from(convertedExpression);
				cutFiles.push(new AttachmentBuilder(buffer, { name: fname }));
			}
			embed.addFields({
				name: 'Expresión modificada',
				value: embeddedModified,
			});
		}
		if (embeddedOutput.length > 1024) {
			const fname = 'output.txt';
			embeddedOutput = scape(
				'',
				`La salida se encuentra en el archivo adjunto ${fname}`,
			);
			const buffer = Buffer.from(output);
			cutFiles.push(new AttachmentBuilder(buffer, { name: fname }));
		}
		embed.addFields({
			name: 'Salida',
			value: embeddedOutput,
		});

		if (success) {
			embed.setColor('Blurple').setTitle('Expresión evaluada con éxito');
		} else {
			embed
				.setColor('Red')
				.setTitle('Evaluación de la expresión fallida');
		}

		await interaction.editReply({
			embeds: [embed],
			files: cutFiles,
		});
	},
};

export default hCmd;
