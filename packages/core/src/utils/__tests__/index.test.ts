import { clear, defaultSetup } from '../index';
import { singleRun } from '../hooks';
import { createData } from '../test/utils';

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

test('defaultSetup', () => {
	const data = createData({
		context: {
			strokeWeight: jest.fn(),
			canvas: document.createElement('canvas'),
		},
		measures: {
			width: 10,
			height: 10,
		},
	});
	singleRun(() => {
		// console.log('HAHAHAHAHAH');

		defaultSetup();
	}, data);

	expect(data.context.strokeWeight).toHaveBeenCalledTimes(1);
	expect(data.context.strokeWeight).toHaveBeenCalledWith(2);
});
