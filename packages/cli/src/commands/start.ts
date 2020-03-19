import { Command, flags } from '@oclif/command';
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
} from '../utils';

export default class Start extends Command {
	static description = 'run a server with live reload';

	static examples = [`$ pieza start`];

	static flags = {
		help: flags.help({ char: 'h' }),
		port: flags.string({ char: 'p', description: 'port', default: '4321' }),
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

		const compiler = createCompiler({
			entry,
			plugins,
		});

		const routes = getRoutes(piezas);
		const server = createDevServer(compiler, routes);
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
	}
}
