import {
	run,
	singleRun,
	getCurrentData,
	setCurrentData,
	cleanCurrentData,
	currentData,
} from '../hooks';
import { createData } from '../../test/utils';

test('setCurrentData', () => {
	const data = createData();

	setCurrentData(data);

	expect(currentData).toBe(data);
});

test('cleanCurrentData', () => {
	const data = createData();
	setCurrentData(data);
	cleanCurrentData();

	expect(currentData).toBe(null);
});

test('getCurrentData', () => {
	const data = createData();
	setCurrentData(data);
	cleanCurrentData();

	expect(currentData).toBe(null);
});

test('getCurrentData', () => {
	const data = createData();
	setCurrentData(data);

	expect(getCurrentData('hookName')).toBe(data);
});

test('getCurrentData should throw an error when there is not data', () => {
	cleanCurrentData();

	expect(() => {
		getCurrentData('hookName');
	}).toThrowError();
});

test('singleRun should run the given function within the given context', () => {
	const data = createData();

	const fn = jest.fn(() => {
		expect(getCurrentData('hookName') == data);
	});

	singleRun(fn, data);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('singleRun should return the result', () => {
	const data = createData();

	const fn = jest.fn(() => {
		const context = getCurrentData('hookName');
		expect(context == data);
		return context;
	});

	expect(singleRun(fn, data)).toBe(data);
	expect(fn).toHaveBeenCalledTimes(1);
});

test('run should run all the given functions within the given context', () => {
	const data = createData();

	const fn1 = jest.fn(() => {
		expect(getCurrentData('hookName') == data);
	});

	const fn2 = jest.fn(() => {
		expect(getCurrentData('hookName') == data);
	});

	run([fn1, fn2], data);

	expect(fn1).toHaveBeenCalledTimes(1);
	expect(fn2).toHaveBeenCalledTimes(1);
});

test('run should ignore null or undefined', () => {
	const data = createData();

	const fn = jest.fn(() => {
		expect(getCurrentData('hookName') == data);
	});

	run([null, undefined, fn], data);

	expect(fn).toHaveBeenCalledTimes(1);
});

test('run should run all the function even when one fails', () => {
	const data = createData();

	const fn1 = () => {
		throw new Error('error');
	};

	jest.spyOn(console, 'error');

	const fn2 = jest.fn(() => {
		expect(getCurrentData('hookName') == data);
	});

	run([fn1, fn2], data);

	expect(fn2).toHaveBeenCalledTimes(1);
	expect(console.error).toHaveBeenCalledTimes(1);
});
