import p5 from 'p5';
import { drawPoint, drawLine, clear, background, defaultSetup } from '../index';
import { singleRun } from '../hooks';
import { createData } from '../../test/utils';

test('drawPoint', () => {
	const data = createData({
		context: {
			point: jest.fn(),
		},
	});

	const vector = new p5.Vector().set(5, 10, 4);

	singleRun(() => {
		drawPoint(vector);
	}, data);

	expect(data.context.point).toBeCalledTimes(1);
	expect(data.context.point).toBeCalledWith(5, 10, 4);
});

test('drawLine', () => {
	const data = createData({
		context: {
			line: jest.fn(),
		},
	});

	const startPoint = new p5.Vector().set(10, 20, 30);
	const endPoint = new p5.Vector().set(40, 50, 60);

	singleRun(() => {
		drawLine(startPoint, endPoint);
	}, data);

	expect(data.context.line).toBeCalledTimes(1);
	expect(data.context.line).toHaveBeenCalledWith(10, 20, 30, 40, 50, 60);
});

test('clean', () => {
	const data = createData({
		context: {
			clear: jest.fn(),
		},
	});

	singleRun(() => {
		clear();
	}, data);

	expect(data.context.clear).toHaveBeenCalledTimes(1);
});

test('background', () => {
	const data = createData({
		context: {
			background: jest.fn(),
		},
	});

	const color = 'black';

	singleRun(() => {
		background(color);
	}, data);

	expect(data.context.background).toHaveBeenCalledTimes(1);
	expect(data.context.background).toHaveBeenCalledWith(color);
});

test('defaultSetup', () => {
	const data = createData({
		context: {
			strokeWeight: jest.fn(),
		},
	});
	singleRun(() => {
		defaultSetup();
	}, data);

	expect(data.context.strokeWeight).toHaveBeenCalledTimes(1);
	expect(data.context.strokeWeight).toHaveBeenCalledWith(2);
});
