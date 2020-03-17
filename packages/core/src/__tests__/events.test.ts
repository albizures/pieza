import {
	wrapEventHandler,
	wrapEventHandlers,
	setEventHandlers,
} from '../events';
import { createContext, createData } from '../test/utils';
import { getCurrentData, setCurrentData } from '../utils/hooks';

test('setEventHandlers', () => {
	const context = createContext();
	const keyPressed = jest.fn();

	setEventHandlers(
		{
			keyPressed,
		},
		context,
	);

	expect(context.keyPressed).toBe(keyPressed);
});

test('wrapEventHandler', () => {
	const context = createContext();
	const data = createData({
		context,
	});

	setCurrentData(data);

	const keyPressed = jest.fn(() => {
		expect(getCurrentData('hookName')).toBe(data);
		return true;
	});

	expect(wrapEventHandler(keyPressed, data)()).toBe(true);
	expect(keyPressed).toHaveBeenCalledTimes(1);
});

test('wrapEventHandlers', () => {
	const context = createContext();
	const data = createData({
		context,
	});

	const keyPressed = jest.fn(() => {
		expect(getCurrentData('hookName')).toBe(data);
	});
	const keyReleased = jest.fn(() => {
		expect(getCurrentData('hookName')).toBe(data);
	});

	setCurrentData(data);
	const events = {
		keyPressed,
		keyReleased,
	};

	wrapEventHandlers(events, data);
	events.keyPressed();
	events.keyReleased();

	expect(events.keyPressed).not.toBe(keyPressed);
	expect(events.keyReleased).not.toBe(keyReleased);

	expect(keyPressed).toHaveBeenCalledTimes(1);
	expect(keyReleased).toHaveBeenCalledTimes(1);
});
