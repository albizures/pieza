import { Command, flags } from '@oclif/command';
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
		const files = await getFiles(getMainFolder());
		const entry = await getEntries(files);
		const plugins = await getPlugins(files);

		const compiler = createCompiler({
			mode: 'production',
			entry,
			plugins,
		});

		compiler.run((error, stats) => {
			if (error || stats.hasErrors()) {
				console.log(error || stats.toString());
				console.log('error');
			} else {
				console.log('done');
			}
		});
	}
}
