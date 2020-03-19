// @pieza-name: Pieza examples
import { create, useContext, useMeasures } from '@pieza/core';

export default create({
	name: 'Pieza examples',
	setup() {
		const context = useContext();
		const { centerX, centerY } = useMeasures();
		context.circle(centerX, centerY, 50);
	},
});
