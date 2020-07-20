import { create, useContext, useState } from 'pieza';

let x = 0;
let y = 0;

interface Circle {
	x: number;
	y: number;
	r: number;
}

interface State {
	circles: Circle[];
}

export default create<null, State>({
	name: 'My title',
	autoClean: true,
	setup() {
		const context = useContext();
		const circles = [];
		for (let index = 0; index < 10000; index++) {
			circles.push({
				x: context.random(0, context.width),
				y: context.random(0, context.height),
				r: context.random(50, 200),
			});
		}

		return {
			circles,
		};
	},
	draw() {
		const { circles } = useState<State>();
		const context = useContext();

		for (let index = 0; index < circles.length; index++) {
			const circle = circles[index];

			context.circle(circle.x, circle.y, circle.r);
		}
		context.circle(x, y, 40);
	},
	mouseMoved() {
		const context = useContext();
		x = context.mouseX;
		y = context.mouseY;
	},
});
