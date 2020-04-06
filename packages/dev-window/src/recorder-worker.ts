import execa from 'execa';
import dataUriToBuffer from 'data-uri-to-buffer';

import { Message, TypeMessage, StartMessage, AddFrameMessage } from './types';

interface Recorder {
	process: execa.ExecaChildProcess<string>;
}

let recorder: Recorder | null;

process.on('message', async (message: Message) => {
	const { type } = message;
	if (type === TypeMessage.Start) {
		const { sketchName } = message as StartMessage;

		recorder = createRecorder(sketchName);
	}

	if (type === TypeMessage.AddFrame && recorder) {
		const { image } = message as AddFrameMessage;

		await addFrame(recorder.process, dataUriToBuffer(image));
	}

	if (type === TypeMessage.Save && recorder) {
		if (!recorder.process.killed && recorder.process.stdin) {
			recorder.process.stdin.end();
		}
	}
});

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

const createRecorder = (sketch: string): Recorder => {
	const ffmpegPath = 'ffmpeg';
	const fps = 60;

	const args = [
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

	if (ffmpeg.stdout) {
		ffmpeg.stdout.on('data', (data) => console.log(data.toString()));
	}

	if (ffmpeg.stdin) {
		ffmpeg.stdin.on('data', (data) => console.info(data.toString()));
		ffmpeg.stdin.on('finish', () => process.exit());
	}

	if (ffmpeg.stderr) {
		ffmpeg.stderr.on('data', (data) => console.error(data.toString()));
	}

	return {
		process: ffmpeg,
	};
};
