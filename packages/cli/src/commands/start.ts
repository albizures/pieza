import { Command, flags } from '@oclif/command';
import execa from 'execa';
import getPort from 'get-port';
import {
	getEntries,
	getFiles,
	getPlugins,
	createCompiler,
	createDevServer,
	getMainFolder,
	getRoutes,
	parseFiles,
	getPackage,
	isYarnAvailable,
} from '../utils';

export default class Start extends Command {
	static description = 'run a server with live reload';

	static examples = [`$ pieza start`];

	static flags = {
		help: flags.help({ char: 'h' }),
		verbose: flags.boolean({ char: 'v', description: 'default webpack ouput' }),
		port: flags.string({ char: 'p', description: 'port', default: '4321' }),
		record: flags.string({
			char: 'r',
			description: 'open an electron window to record the sketch',
		}),
		electron: flags.string({
			char: 'e',
			description: 'opens an electron window',
		}),
		host: flags.string({
			description: 'host',
			default: 'localhost',
		}),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(Start);
		const files = await getFiles(getMainFolder());
		const piezas = parseFiles(files);
		const entry = await getEntries(piezas);
		const plugins = await getPlugins(piezas);

		const customPort = Number(flags.port);
		const defaultPort = Number.isNaN(customPort) ? 4321 : customPort;

		const isElectron = Boolean(flags.electron) || Boolean(flags.record);
		const sketch = flags.record || flags.electron;

		if (sketch && !entry[sketch]) {
			console.error(`Invalid sketch name: ${sketch}`);
			console.error(
				`Sketches available: \n\t- ${Object.keys(entry).join('\n\t- ')}`,
			);
			throw new Error(`Invalid sketch name: ${sketch}`);
		}

		if (isElectron) {
			const { devDependencies } = getPackage();

			if (
				typeof devDependencies !== 'object' ||
				!Object.keys(devDependencies).includes('@pieza/dev-window')
			) {
				if (await isYarnAvailable()) {
					await execa('yarn', ['add', '--dev', '@pieza/dev-window']);
				} else {
					await execa('npm', ['install', '-D', '@pieza/dev-window']);
				}
			}

			entry['electron-page'] = require.resolve('@pieza/dev-window/dist/page');
		}

		const compiler = createCompiler(
			{
				entry,
				plugins,
			},
			isElectron,
		);

		const routes = getRoutes(piezas);
		const server = createDevServer(compiler, routes, flags.verbose);
		const port = await getPort({ port: defaultPort });
		const host = flags.host || 'localhost';

		server.listen(port, host, (error: Error) => {
			if (error) {
				throw error;
			}

			const baseUrl = `http://${host}:${port}`;

			console.log('Sketches available:');
			piezas.forEach((pieza) => {
				const { name, to } = pieza;
				console.log(`  ${name} -> ${baseUrl}/${name}`);
			});
		});

		if (isElectron) {
			if (flags.record) {
				process.env.PIEZA_RECORDING = 'true';
			}

			process.env.PIEZA_SKETCH = sketch;

			await execa('electron', [require.resolve('@pieza/dev-window')]);

			server.close();
		}
	}
}
