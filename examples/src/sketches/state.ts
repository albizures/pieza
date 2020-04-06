import { create, useContext, useMutableState, useState } from 'pieza';

interface Circle {
	x: number;
	y: number;
	radio: number;
}

interface State {
	circles: Circle[];
	x: number;
	y: number;
}

const speed = 1;

export default create<null, State>({
	name: 'Using state',
	autoClean: true,
	setup() {
		return {
			circles: [],
			x: 0,
			y: 0,
		};
	},
	update({ circles }) {
		for (const circle of circles) {
			circle.radio += speed;
		}

		return {
			circles,
		};
	},
	draw() {
		const context = useContext();
		const { x, y, circles } = useState<State>();

		for (const circle of circles) {
			context.circle(circle.x, circle.y, circle.radio);
		}
	},
	mouseMoved() {
		const context = useContext();
		const [state, setState] = useMutableState<State>();
		const circle = {
			radio: 10,
			x: context.mouseX,
			y: context.mouseY,
		};

		setState({
			...state,
			circles: state.circles.concat(circle),
		});
	},
});
