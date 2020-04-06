import { fork } from 'child_process';
import { TypeMessage } from './types';

const sketch = process.env.PIEZA_SKETCH;

const createRecorder = (canvas: HTMLCanvasElement) => {
	const worker = fork(require.resolve('./recorder-worker.js'), [], {
		stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
	});

	if (worker.stdout) {
		worker.stdout.on('data', (data) => console.log(data.toString()));
	}

	if (worker.stderr) {
		worker.stderr.on('data', (data) => console.error(data.toString()));
	}

	return {
		abort: () => {
			worker.send({
				type: TypeMessage.Abort,
			});
		},
		addFrame: async () => {
			worker.send({
				image: canvas.toDataURL('image/jpeg'),
				type: TypeMessage.AddFrame,
			});
		},
		start: () => {
			worker.send({
				type: TypeMessage.Start,
				sketchName: sketch,
			});
		},
		save: () => {
			worker.send({
				type: TypeMessage.Save,
			});
		},
	};
};

export { createRecorder };
