import ora from 'ora';
import { Command, flags } from '@oclif/command';
import { getEntries, getFiles } from '../utils';
import { defaultBuildPath } from '../config';
import { getPlugins, createCompiler } from '../utils/webpack';
import {
	parseFiles,
	getMainFolder,
	getSketchesData,
	clean,
} from '../utils/files';

export default class Start extends Command {
	static description = 'build all';

	static examples = [`$ pieza build`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		process.env.NODE_ENV = 'production';
		const spinner = ora('Compiling...');

		clean(defaultBuildPath);
		const files = await getFiles(getMainFolder());
		const sketches = parseFiles(files);
		const entry = await getEntries(sketches);
		const sketchesData = await getSketchesData(entry, sketches);

		const plugins = await getPlugins(sketches, sketchesData);

		spinner.start();

		const compiler = createCompiler({
			production: true,
			entry,
			plugins,
		});

		compiler.run((error, stats) => {
			spinner.stop();
			if (error || stats.hasErrors()) {
				console.error(error || stats.toString());
			} else {
				console.log('done');
			}
		});
	}
}
