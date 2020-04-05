import { app, BrowserWindow, screen } from 'electron';
import debug from 'electron-debug';
import { getSize } from './utils';

debug({
	showDevTools: false,
});

const url = process.env.PIEZA_URL;

const createWindow = async () => {
	await app.whenReady();
	const { width, height } = getSize(300);
	const [mainScreen] = screen.getAllDisplays();
	const x = mainScreen.size.width - width - 20;
	const y = mainScreen.size.height - height - 20;

	let win = new BrowserWindow({
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
