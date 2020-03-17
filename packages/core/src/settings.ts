import { Required } from 'utility-types';
import { getLocalSettings } from './localSettings';
import {
	Context,
	SettingsFactory,
	SettingsDescription,
	describedSetting,
	ConfigSettings,
	NumberSetting,
	BooleanSetting,
	StringSetting,
	DescribedSetting,
	PrimitiveTypeSetting,
} from './types';

const isSettingsFactory = <T>(
	factory: SettingsFactory<T> | T,
): factory is SettingsFactory<T> => {
	return typeof factory === 'function';
};

const isDescribedSetting = <T>(
	setting: DescribedSetting<T> | unknown,
): setting is DescribedSetting<T> => {
	return (
		typeof setting === 'object' &&
		(setting as DescribedSetting<T>)[describedSetting]
	);
};

type ParsedSettings<T extends object> = {
	description: SettingsDescription<T>;
	values: T;
};

const parseSettings = <T extends object>(
	settings: ConfigSettings<T>,
	context: Context,
): ParsedSettings<T> => {
	if (isSettingsFactory(settings)) {
		return parseSettings(settings(context), context);
	}

	const values: Partial<T> = {};
	const description: Partial<SettingsDescription<T>> = {};

	const seed = {
		description,
		values,
	};

	const result = Object.keys(settings).reduce((parsed, key) => {
		// @ts-ignore
		const setting = settings[key];

		if (isDescribedSetting(setting)) {
			// @ts-ignore
			parsed.description[key] = setting;
			// @ts-ignore
			parsed.values[key] = setting.value;
		} else {
			// @ts-ignore
			parsed.description[key] = {
				type: typeof setting,
				value: setting,
				label: key,
				[describedSetting]: true,
			};
			// @ts-ignore
			parsed.values[key] = setting;
		}

		return parsed;
	}, seed);

	return (result as unknown) as ParsedSettings<T>;
};

/**
 * checks local settings and merge them if
 * it's needed and returns their description
 */
const getSettings = <T extends object>(
	name: string,
	settings: ConfigSettings<T>,
	context: Context,
): { values: T; description: SettingsDescription<T> } => {
	const localSettings = getLocalSettings<T>(name);

	const properties = Object.keys(localSettings);

	if (localSettings && properties.length > 0) {
		console.warn(
			`Using local setting for ${properties.join(', ')} in pieza '${name}'`,
		);
	}

	const { values, description } = parseSettings(settings, context);

	return {
		values: {
			...values,
			...localSettings,
		},
		description: description,
	};
};

type SettingOptions<S> = Partial<Omit<S, 'type' | symbol>>;

type NumberSettingOptions = Required<
	SettingOptions<NumberSetting>,
	'label' | 'value'
>;

type BooleanSettingOptions = Required<
	SettingOptions<BooleanSetting>,
	'label' | 'value'
>;

type StringSettingOptions = Required<
	SettingOptions<StringSetting>,
	'label' | 'value'
>;

const NumberValue = ({
	value,
	label,
	min = -Infinity,
	max = Infinity,
	slide = false,
	step,
}: NumberSettingOptions): NumberSetting => ({
	label,
	value,
	min,
	max,
	slide,
	step,
	type: PrimitiveTypeSetting.Number,
	[describedSetting]: true,
});

const BooleanValue = ({
	value,
	label,
}: BooleanSettingOptions): BooleanSetting => ({
	value,
	label,
	type: PrimitiveTypeSetting.Boolean,
	[describedSetting]: true,
});

const StringValue = ({
	value,
	label,
}: StringSettingOptions): StringSetting => ({
	value,
	label,
	type: PrimitiveTypeSetting.String,
	[describedSetting]: true,
});

export { parseSettings, NumberValue, StringValue, BooleanValue, getSettings };
