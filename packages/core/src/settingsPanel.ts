import { css, glob } from 'goober';
import debounce from 'lodash.debounce';
import {
	PiezaData,
	PrimitiveTypeSetting,
	DescribedSetting,
	NumberSetting,
} from './types';

const defaultSize = 300;

const styles = {
	container: css`
		position: fixed;
		left: 100%;
		top: 0;
		height: 100%;
		border-left: 1px solid rgb(223, 226, 229);
		background: white;
		transition: left 0.2s;
	`,
	floatTab: css`
		position: absolute;
		right: calc(100% - 1px);
		padding: 0.375rem 0.45rem;
		border-left: 1px solid rgb(223, 226, 229);
		border-bottom: 1px solid rgb(223, 226, 229);
	`,
	floatTabBottom: css`
		display: block;
		line-height: 1;
		padding: 0;
		font-size: 30px;
		background: white;
		border-radius: 50%;
		border: 0;
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

const removeSpaces = (str: string) => str.trim().replace(/[\s\?.]/g, '-');

const createId = (name: string, label: string) => {
	return removeSpaces(`${name}-${label}`);
};

const createSetting = <S, T>(
	data: PiezaData<S, T>,
	name: keyof PiezaData<S, T>['settingsDescription'],
	onChange: (name: string, value: unknown) => void,
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
	const inputElement = input.elt as HTMLInputElement;
	const elements = [label, input];

	const isBoolean = setting.type === PrimitiveTypeSetting.Boolean;

	const handleChange = () => {
		onChange(name as string, isBoolean ? inputElement.checked : input.value());
	};

	inputElement.addEventListener('change', handleChange);
	inputElement.addEventListener('keydown', handleChange);

	if (isBoolean) {
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
	const element = resizeBar.elt as HTMLDivElement;
	let lastSize: number;

	const onResize = (event: MouseEvent) => {
		const panel = element.parentElement;
		if (!panel) {
			return;
		}

		const size = window.innerWidth - event.x;

		panel.style.left = `calc(100% - ${size}px)`;
		panel.style.width = `${size}px`;
		lastSize = size;
	};

	const onStartResize = () => {
		const panel = element.parentElement;
		if (!panel) {
			return;
		}

		panel.style.transition = 'none';
		window.addEventListener('mouseup', onEndResize);
		window.addEventListener('mousemove', onResize);
	};

	const onEndResize = () => {
		const panel = element.parentElement;
		if (!panel) {
			return;
		}

		panel.style.transition = '';
		window.removeEventListener('mousemove', onResize);
		window.removeEventListener('mouseup', onEndResize);
		if (lastSize) {
			saveSize(lastSize);
		}
	};

	element.addEventListener('mousedown', onStartResize);

	return resizeBar;
};

type UpdateSetting = (settingName: string, value: unknown) => void;

const saveSize = (value: number) => {
	localStorage.setItem('settings-panel-size', String(value));
};

const getSize = () => {
	const value = localStorage.getItem('settings-panel-size');
	const localSize = value === null ? NaN : Number(value);

	return Number.isNaN(localSize) ? defaultSize : localSize;
};

const createFloatTab = <S, T>(
	data: PiezaData<S, T>,
	onClick: EventHandlerNonNull,
) => {
	const { context } = data;
	const label = context
		.createElement('button', '⚙️')
		.addClass(styles.floatTabBottom);

	const tab = context
		.createDiv()
		.child(label)
		.addClass(styles.floatTab);

	const element = tab.elt as HTMLDivElement;

	element.addEventListener('click', onClick);

	return tab;
};

const createSettingsPanel = <S, T>(
	data: PiezaData<S, T>,
	updateSetting: UpdateSetting,
) => {
	glob`
		body {
			font-size: 1rem;
			line-height: 1.5;
		}
	`;
	const { context, settingsDescription } = data;
	const container = context.createDiv();
	let isOpen = false;

	const size = getSize();

	const floatTab = createFloatTab(data, () => {
		const size = getSize();
		if (isOpen) {
			isOpen = false;
			container.style('left', `100%`);
		} else {
			container.style('left', `calc(100% - ${size}px)`);
			isOpen = true;
		}
	});

	container
		.child(createResizeBar(data))
		.child(floatTab)
		.addClass(styles.container)
		.style('width', `${size}px`);

	const onChange = debounce((name: string, value: unknown) => {
		updateSetting(name, value);
	}, 100);

	Object.keys(settingsDescription).forEach((name) => {
		container.child(
			createSetting(
				data,
				name as keyof PiezaData<S, T>['settingsDescription'],
				onChange,
			),
		);
	});
};

export { createSettingsPanel };
