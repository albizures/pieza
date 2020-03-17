import { Required } from 'utility-types';
import { getLocalSettings } from './localSettings';
import {
	Context,
	Settings,
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

type ParsedSettings<T extends Settings> = {
	description: SettingsDescription<T>;
	values: Settings;
};

const parseSettings = <T extends Settings>(
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

	return Object.keys(settings).reduce((parsed, key: keyof T) => {
		const setting = settings[key];
		type SettingType = T[keyof T];

		if (isDescribedSetting<SettingType>(setting)) {
			parsed.description[key] = setting as DescribedSetting<SettingType>;
			parsed.values[key] = setting.value as SettingType;
		} else {
			parsed.description[key] = {
				type: typeof setting as PrimitiveTypeSetting,
				value: setting as SettingType,
				label: key as string,
				[describedSetting]: true,
			};
			parsed.values[key] = setting as SettingType;
		}

		return parsed;
	}, seed) as ParsedSettings<T>;
};

/**
 * checks local settings and merge them if
 * it's needed and returns their description
 */
const getSettings = <T extends Settings>(
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
