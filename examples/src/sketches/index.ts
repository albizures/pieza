// @pieza-name: Pieza examples
import { create, useContext, useMeasures } from '@pieza/core';
import { drawLine } from '../utils';

export default create({
	name: 'Pieza examples',
	setup() {
		const context = useContext();
		const { centerX, centerY } = useMeasures();
		context.circle(centerX, centerY, 50);

		drawLine(
			context.createVector(centerX, centerY),
			context.createVector(centerX + 50, centerY + 50),
		);
	},
});
