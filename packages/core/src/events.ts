import p5 from 'p5';
import { useContext } from './hooks';
import { singleRun } from './utils/hooks';
import {
	P5EventHandler,
	PiezaData,
	P5EventHandlers,
	P5EventsNames,
} from './types';

const windowResized = () => {
	const context = useContext();
	context.resizeCanvas(context.windowWidth, context.windowHeight);
};

const wrapEventHandler = <S>(fn: P5EventHandler, data: PiezaData<S>) => {
	const handler: P5EventHandler = () => {
		return singleRun(fn, data);
	};

	return handler;
};

const wrapEventHandlers = <T, S>(
	handlers: P5EventHandlers,
	data: PiezaData<S>,
) => {
	eachName((name) => {
		const handler = handlers[name];

		if (handler) {
			handlers[name] = wrapEventHandler(handler, data);
		} else if (name === P5EventsNames.windowResized) {
			handlers.windowResized = wrapEventHandler(windowResized, data);
		}
	});
};

const eachName = (fn: (name: P5EventsNames) => void) => {
	Object.keys(P5EventsNames).forEach((key) => {
		// @ts-ignore
		const name: P5EventsNames = P5EventsNames[key];

		fn(name);
	});
};

const setEventHandlers = (handlers: P5EventHandlers, context: p5) => {
	eachName((name) => {
		const handler = handlers[name];

		if (handler) {
			context[name] = handler;
		}
	});
};
export { wrapEventHandler, wrapEventHandlers, setEventHandlers };
