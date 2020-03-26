import ora from 'ora';
import { Command, flags } from '@oclif/command';
import { getEntries, getFiles } from '../utils';
import { getPlugins, createCompiler } from '../utils/webpack';
import { parseFiles, getMainFolder } from '../utils/files';

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
		const piezas = parseFiles(files);
		const entry = await getEntries(piezas);
		const plugins = await getPlugins(piezas);

		const compiler = createCompiler({
			production: true,
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
