import {
	useMeasures,
	useState,
	useContext,
	useRecorder,
	useSettings,
	useMutableState,
} from '../hooks';
import { singleRun } from '../utils/hooks';
import { createContext, createData } from '../utils/test/utils';

test('useContext', () => {
	const context = createContext();
	const data = createData({
		context,
	});

	const fn = jest.fn(() => {
		expect(useContext()).toBe(context);
	});

	singleRun(fn, data);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('useState', () => {
	const state = {};
	const data = createData({
		state,
	});

	const fn = jest.fn(() => {
		expect(useState()).toBe(state);
	});

	singleRun(fn, data);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('useSettings', () => {
	const settings = {};
	const data = createData({
		settings,
	});

	const fn = jest.fn(() => {
		expect(useSettings()).toBe(settings);
	});

	singleRun(fn, data);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('useMutableState', () => {
	const state: Record<string, unknown> = {};
	const data = createData({
		state,
	});

	const fn = jest.fn(() => {
		const [value, setState] = useMutableState();
		expect(state).toBe(state);
		expect(typeof setState).toBe('function');

		setState({
			foo: 1,
		});
	});

	singleRun(fn, data);

	expect(state.foo).toBe(1);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('useMeasures', () => {
	const measures = {};
	const data = createData({
		measures,
	});

	const fn = jest.fn(() => {
		expect(useMeasures()).toBe(measures);
	});

	singleRun(fn, data);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('useRecorder', () => {
	const context = createContext({
		canvas: {
			captureStream: jest.fn(() => ({})),
		},
	});
	const data = createData({ context });

	const fn = jest.fn(() => {
		const recorder = useRecorder();
		expect(typeof recorder.pause).toBe('function');
		expect(typeof recorder.resume).toBe('function');
		expect(typeof recorder.save).toBe('function');
		expect(typeof recorder.start).toBe('function');
	});

	singleRun(fn, data);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('useRecorder should create a singleton recorder', () => {
	const context = createContext({
		canvas: {
			captureStream: jest.fn(() => ({})),
		},
	});
	const data = createData({
		context,
	});

	const fn = jest.fn(() => {
		expect(useRecorder()).toBe(useRecorder());
	});

	singleRun(fn, data);
	expect(fn).toHaveBeenCalledTimes(1);
});
