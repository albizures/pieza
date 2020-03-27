import { Command, flags } from '@oclif/command';
import execa from 'execa';
import getPort from 'get-port';
import { defaultBuildPath } from '../config';
import {
	getEntries,
	getFiles,
	getRoutes,
	getPackage,
	isValidSketch,
} from '../utils';
import { getPlugins, createCompiler, createDevServer } from '../utils/webpack';
import {
	parseFiles,
	getMainFolder,
	clean,
	getSketchesData,
} from '../utils/files';
import { isYarnAvailable } from '../utils/env';
import { EnvType } from '../types';

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
		const customPort = Number(flags.port);
		const defaultPort = Number.isNaN(customPort) ? 4321 : customPort;

		const isElectron = Boolean(flags.electron) || Boolean(flags.record);
		const sketchName = flags.record || flags.electron;

		clean(defaultBuildPath);

		const files = await getFiles(getMainFolder());
		let sketches = parseFiles(files);

		if (sketchName) {
			if (!isValidSketch(sketches, sketchName)) {
				console.error(`Invalid sketch name: ${sketchName}`);
				console.error(`Sketches available:`);
				sketches.forEach((sketch) => {
					console.error(`\t- ${sketch.id}`);
				});

				throw new Error(`Invalid sketch name: ${sketchName}`);
			} else {
				sketches = sketches.filter((sketch) => {
					return sketch.id === sketchName;
				});
			}
		}

		const entry = await getEntries(sketches);
		const data = await getSketchesData(entry);
		const plugins = await getPlugins(sketches, data);

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

		const compiler = createCompiler({
			entry,
			plugins,
			envType: isElectron ? EnvType.Electron : EnvType.Web,
		});

		const routes = getRoutes(sketches);
		const server = createDevServer(compiler, routes, flags.verbose);
		const port = await getPort({ port: defaultPort });
		const host = flags.host || 'localhost';

		server.listen(port, host, (error: Error) => {
			if (error) {
				throw error;
			}

			const baseUrl = `http://${host}:${port}`;

			console.log('Sketches available:');
			sketches.forEach((sketch) => {
				const { id, to } = sketch;
				console.log(`  ${id} -> ${baseUrl}/${id}`);
			});
		});

		if (isElectron) {
			if (flags.record) {
				process.env.PIEZA_RECORDING = 'true';
			}

			process.env.PIEZA_SKETCH = sketchName;

			await execa('electron', [require.resolve('@pieza/dev-window')]);

			server.close();
		}
	}
}
