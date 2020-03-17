class MediaRecorder {}

MediaRecorder.prototype.pause = jest.fn();
MediaRecorder.prototype.resume = jest.fn();
MediaRecorder.prototype.stop = jest.fn();

MediaRecorder.isTypeSupported = jest.fn(() => true);

const mockMediaRecorder = () => {
	global.MediaRecorder = MediaRecorder;
};

mockMediaRecorder();
