import { remote } from 'electron';
import debouce from 'lodash.debounce';
import { createRecorder } from './recorder';
import { wait, getSize } from './utils';

const sketchName = process.env.PIEZA_SKETCH;
const win = remote.getCurrentWindow();

window.addEventListener('keyup', (event: KeyboardEvent) => {
	if (event.key === 'Escape') {
		remote.getCurrentWindow().close();
	}
});

win.on(
	'resize',
	debouce(() => {
		const piezas = (window as any).piezas;
		if (sketchName && piezas.has(sketchName)) {
			const sketch = piezas.get(sketchName);
			if (sketch) {
				sketch.resize();
			}
		}
	}, 100),
);

const updateBoundaries = (max: number) => {
	const { width: currentWidth, height: currentHeight, y, x } = win.getBounds();
	const { width, height } = getSize(max);

	win.setBounds({
		width,
		height,
		x: x - (width - currentWidth),
		y: y - (height - currentHeight),
	});
};

win.on('focus', () => updateBoundaries(500));
win.on('blur', () => updateBoundaries(300));

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
