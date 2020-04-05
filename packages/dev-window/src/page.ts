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

if (process.env.PIEZA_RECORDING) {
	let recorder: ReturnType<typeof createRecorder> | null;

	window.addEventListener('keyup', (event: KeyboardEvent) => {
		if (event.key !== ' ') {
			return;
		}

		if (recorder) {
			recorder.save();
			recorder = null;
			return;
		}

		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		recorder = createRecorder(canvas);
		recorder.start();

		win.on('closed', () => {
			if (recorder) {
				recorder.abort();
			}
		});
	});
} else {
	win.on('focus', () => updateBoundaries(500));
	win.on('blur', () => updateBoundaries(300));
}
