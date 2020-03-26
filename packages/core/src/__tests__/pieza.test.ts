import { addDraw, addSettings, addSetup } from '../pieza';
import { createData, createContext, createSettings } from '../utils/test/utils';
import { setCurrentData } from '../utils/hooks';

test('addSetup', () => {
	const width = 100;
	const height = 100;
	const context = createContext({
		strokeWeight: jest.fn(),
		createCanvas: jest.fn(),
		width,
		height,
	});
	const data = createData({
		setup: jest.fn(),
		draw: jest.fn(),
		measures: {
			width,
			height,
		},
	});

	setCurrentData(data);
	addSetup(data, context);

	context.setup();

	expect(data.measures.width).toBe(width);
	expect(data.measures.height).toBe(height);
	expect(data.measures.centerX).toBe(width / 2);
	expect(data.measures.centerY).toBe(height / 2);

	expect(data.setup).toHaveBeenCalledTimes(1);
	expect(data.draw).toHaveBeenCalledTimes(1);
});

test('addSettings', () => {
	const data = createData();
	const context = createContext();
	const settings = createSettings();

	addSettings(data, context, settings);

	expect(typeof data.settingsDescription).toBe('object');
	expect(typeof data.settings).toBe('object');
});

test('addDraw', () => {
	const data = createData({
		draw: jest.fn(),
		update: jest.fn(),
	});
	const context = createContext({
		strokeWeight: jest.fn(),
	});

	addDraw(data, context);

	setCurrentData(data);
	context.draw();

	expect(data.update).toHaveBeenCalledTimes(1);
	expect(data.draw).toHaveBeenCalledTimes(1);
});
