import { remote } from 'electron';
import { createRecorder } from './recorder';
import { wait } from './utils';

const win = remote.getCurrentWindow();

window.addEventListener('keyup', (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		remote.getCurrentWindow().close();
	}
});

const setupRecording = async () => {
	const canvas = document.querySelector('canvas') as HTMLCanvasElement;

	if (!canvas) {
		await wait(100);
		setupRecording();
		return;
	}

	const recorder = createRecorder(canvas);

	win.on('closed', () => {
		recorder.save();
	});

	recorder.start();
};

if (process.env.PIEZA_RECORDING) {
	setupRecording();
}
