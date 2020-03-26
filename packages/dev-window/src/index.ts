import { app, BrowserWindow } from 'electron';
import debug from 'electron-debug';

debug({
	showDevTools: false,
});

const sketch = process.env.PIEZA_SKETCH;

const createWindow = async () => {
	await app.whenReady();

	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	win.setAlwaysOnTop(true, 'floating');

	win.loadURL(`http://localhost:4321/${sketch}`);
};

createWindow();
