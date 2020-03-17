import {
	parseSettings,
	StringValue,
	BooleanValue,
	NumberValue,
	getSettings,
} from '../settings';
import { PrimitiveTypeSetting, describedSetting } from '../types';
import { createContext, createSettings } from '../test/utils';
import { setLocalSetting } from '../localSettings';

test('parseSettings', () => {
	const data = createContext();
	const { values, description } = parseSettings(
		{
			primitive: 1,
			describedString: StringValue({
				label: 'this is a string',
				value: 'hello world',
			}),
			describedBoolean: BooleanValue({
				label: 'this is a boolean',
				value: true,
			}),
			describedNumber: NumberValue({
				label: 'this is a number',
				value: 10,
			}),
		},
		data,
	);

	expect(values).toEqual({
		primitive: 1,
		describedString: 'hello world',
		describedBoolean: true,
		describedNumber: 10,
	});

	expect(description).toEqual({
		describedString: {
			[describedSetting]: true,
			type: PrimitiveTypeSetting.String,
			label: 'this is a string',
			value: 'hello world',
		},
		describedBoolean: {
			[describedSetting]: true,
			type: PrimitiveTypeSetting.Boolean,
			label: 'this is a boolean',
			value: true,
		},
		describedNumber: {
			[describedSetting]: true,
			type: PrimitiveTypeSetting.Number,
			label: 'this is a number',
			value: 10,
			max: Infinity,
			min: -Infinity,
			slide: false,
			step: undefined,
		},
		primitive: {
			[describedSetting]: true,
			type: PrimitiveTypeSetting.Number,
			label: 'primitive',
			value: 1,
		},
	});
});

interface TestSettings {
	mySetting: number;
}

test('getSettings', () => {
	const context = createContext();

	const settings = createSettings<TestSettings>({
		mySetting: 5,
	});

	jest.spyOn(console, 'warn');

	setLocalSetting('test', 'mySetting', 10);

	const { values, description } = getSettings<TestSettings>(
		'test',
		settings,
		context,
	);

	expect(typeof values).toBe('object');
	expect(values.mySetting).toBe(10);
	expect(typeof description).toBe('object');
	expect(console.warn).toHaveBeenCalledTimes(1);
	expect(console.warn).toHaveBeenCalledWith(
		expect.stringContaining('mySetting'),
	);
});
