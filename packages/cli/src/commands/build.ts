import { Command, flags } from '@oclif/command';
import ora from 'ora';
import {
	getEntries,
	getFiles,
	getPlugins,
	createCompiler,
	createDevServer,
	getMainFolder,
} from '../utils';

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
		const files = await getFiles(getMainFolder());
		const entry = await getEntries(files);
		const plugins = await getPlugins(files);

		const compiler = createCompiler({
			mode: 'production',
			entry,
			plugins,
		});

		spinner.start();
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
