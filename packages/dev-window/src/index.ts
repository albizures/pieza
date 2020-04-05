import { app, BrowserWindow, screen } from 'electron';
import debug from 'electron-debug';
import { getSize } from './utils';

debug({
	showDevTools: false,
});

const url = process.env.PIEZA_URL;
const recording = Boolean(process.env.PIEZA_RECORDING);
const baseSize = recording ? 600 : 300;

const createWindow = async () => {
	await app.whenReady();
	const { width, height } = getSize(baseSize);
	const [mainScreen] = screen.getAllDisplays();
	const x = mainScreen.size.width - width - 20;
	const y = mainScreen.size.height - height - 20;

	let win = new BrowserWindow({
		resizable: !recording,
		width,
		height,
		x,
		y,
		webPreferences: {
			nodeIntegration: true,
		},
		frame: false,
	});

	win.setAlwaysOnTop(true, 'floating');

	win.loadURL(`http://localhost:4321${url}`);
};

createWindow();
