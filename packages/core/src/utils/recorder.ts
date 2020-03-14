import { Recorder } from '../types';

const getMediaSupportedType = () => {
	return [
		'video/webm',
		'video/webm,codecs=vp9',
		'video/vp8',
		'video/webm;codecs=vp8',
		'video/webm;codecs=daala',
		'video/webm;codecs=h264',
		'video/mpeg',
	].find(MediaRecorder.isTypeSupported);
};

type MediaElement = { captureStream: () => MediaStream };

const createRecorder = (
	canvas: MediaElement,
	defaultName: string,
	videoBitsPerSecond = 2_500_000,
): Recorder => {
	const mimeType = getMediaSupportedType();

	if (!mimeType) {
		throw new Error('Supported media recorder type not found');
	}

	const stream = canvas.captureStream();
	if (!stream) {
		throw new Error('Not available stream found');
	}

	const recordedBlobs: Blob[] = [];

	const mediaRecorder = new MediaRecorder(stream, {
		mimeType,
		videoBitsPerSecond,
	});

	const start = () => {
		// cleaning any previus recording
		recordedBlobs.length = 0;

		mediaRecorder.ondataavailable = onData;
		mediaRecorder.start(100);
	};

	const onData = (event: BlobEvent) => {
		if (event.data && event.data.size > 0) {
			recordedBlobs.push(event.data);
		}
	};

	const pause = () => {
		mediaRecorder.pause();
	};

	const resume = () => {
		mediaRecorder.resume();
	};

	const save = (name = defaultName) => {
		mediaRecorder.stop();
		const blob = new Blob(recordedBlobs, { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 300);
	};

	return {
		mediaRecorder,
		recordedBlobs,
		start,
		pause,
		resume,
		save,
	};
};

export { createRecorder };
