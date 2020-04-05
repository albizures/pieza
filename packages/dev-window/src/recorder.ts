import { nativeImage } from 'electron';
import execa from 'execa';
import { wait } from './utils';

const sketch = process.env.PIEZA_SKETCH;

const getImage = async (canvas: HTMLCanvasElement): Promise<Buffer> => {
	const data = canvas.toDataURL('image/jpeg');

	const image = nativeImage.createFromDataURL(data);

	const jpeg = image.toJPEG(100);

	if (jpeg.length === 0) {
		await wait(10);
		return getImage(canvas);
	}

	return jpeg;
};

const addFrame = (ffmpeg: execa.ExecaChildProcess<string>, data: Buffer) =>
	new Promise((resolve, reject) => {
		if (!ffmpeg.stdin) {
			return;
		}

		ffmpeg.stdin.write(data, (error) => {
			if (!error) {
				resolve();
			} else {
				reject(error);
			}
		});
	});

const createRecorder = (canvas: HTMLCanvasElement) => {
	const ffmpegPath = 'ffmpeg';
	const fps = 60;

	var args = [
		'-y',
		'-f',
		'image2pipe',
		'-r',
		'' + fps,

		// Note: https://trac.ffmpeg.org/ticket/1272
		'-vcodec',
		'mjpeg',
		'-i',
		'-',
		`${sketch}_${Date.now()}.mp4`,
	];

	const ffmpeg = execa(ffmpegPath, args);
	let stopped = false;

	const start = async () => {
		const image = await getImage(canvas);
		await addFrame(ffmpeg, image);

		if (!stopped) {
			setTimeout(start, 0);
		}
	};

	const save = () => {
		if (ffmpeg.killed) {
			return;
		}

		stopped = true;

		setTimeout(() => {
			if (ffmpeg.stdin) {
				ffmpeg.stdin.end();
			}
		}, 1000);
	};

	return {
		abort: () => {
			ffmpeg.kill();
		},
		start,
		save,
	};
};

export { createRecorder };
