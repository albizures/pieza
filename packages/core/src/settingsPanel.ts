import { css, glob } from 'goober';
import {
	PiezaData,
	PrimitiveTypeSetting,
	DescribedSetting,
	NumberSetting,
} from './types';

const styles = {
	container: css`
		position: fixed;
		right: 0;
		top: 0;
		height: 100%;
		border: 1px solid rgb(223, 226, 229);
	`,
	resizeBar: css`
		position: absolute;
		left: -2px;
		top: 0;
		height: 100%;
		width: 4px;
		cursor: ew-resize;
	`,
	setting: css`
		padding: 0 8px;
		margin-bottom: 16px;
	`,
	input: css`
		padding: 0.375rem 0.75rem;
		border: 1px solid #ced4da;
		border-radius: 0.25rem;
		color: #495057;
		font-size: 1rem;
		width: 100%;
		font-weight: 400;
		line-height: 1.5;
	`,
	checkbox: css`
		width: auto;
		margin-right: 0.5rem;
	`,
	range: css`
		padding: 0;
		margin-top: 0.5rem;
	`,
	label: css`
		margin-bottom: 0.5rem;
	`,
};

const isNumberSetting = (
	setting: DescribedSetting<unknown>,
): setting is NumberSetting => {
	return setting.type === PrimitiveTypeSetting.Number;
};

const removeSpaces = (str: string) => str.replace(' ', '-').trim();

const createId = (name: string, label: string) => {
	return `${removeSpaces(name)}-${removeSpaces(label)}`;
};

const createSetting = <S, T>(
	data: PiezaData<S, T>,
	name: keyof PiezaData<S, T>['settingsDescription'],
) => {
	const { settingsDescription, context } = data;
	const setting = settingsDescription[name];

	const id = createId(String(name), setting.label);
	const label = context
		.createElement('label', setting.label)
		.attribute('for', id);

	const input = context
		.createInput()
		.attribute('id', id)
		.class(styles.input);

	const elements = [label, input];

	if (setting.type === PrimitiveTypeSetting.Boolean) {
		elements.reverse();
		input.attribute('type', 'checkbox').addClass(styles.checkbox);
		if (setting.value) {
			input.attribute('checked', 'checked');
		}
	} else {
		input.attribute('value', String(setting.value));
	}

	if (isNumberSetting(setting)) {
		if (Number.isFinite(setting.max)) {
			input.attribute('max', String(setting.max));
		}

		if (Number.isFinite(setting.min)) {
			input.attribute('min', String(setting.min));
		}

		if (setting.slide) {
			input.attribute('type', 'range').addClass(styles.range);
			console.log(setting);

			if (setting.step) {
				input.attribute('step', String(setting.step));
			}
		} else {
			input.attribute('type', 'number');
		}
	}

	const container = context.createDiv().class(styles.setting);

	elements.forEach((element) => {
		container.child(element);
	});

	return container;
};

const createResizeBar = <S, T>(data: PiezaData<S, T>) => {
	const { context } = data;
	const resizeBar = context.createDiv().class(styles.resizeBar);

	return resizeBar;
};

const createSettingsPanel = <S, T>(data: PiezaData<S, T>) => {
	glob`
		body {
			font-size: 1rem;
			line-height: 1.5;
		}
	`;
	const { context, settingsDescription } = data;

	const container = context
		.createDiv()
		.child(createResizeBar(data))
		.addClass(styles.container);

	Object.keys(settingsDescription).forEach((name) => {
		container.child(
			createSetting(data, name as keyof PiezaData<S, T>['settingsDescription']),
		);
	});
};

export { createSettingsPanel };
