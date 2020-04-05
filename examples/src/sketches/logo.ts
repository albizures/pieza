import { Vector } from 'p5';
import {
	create,
	useContext,
	useMeasures,
	useSettings,
	NumberValue,
} from 'pieza';
import { drawLine } from '../utils';

interface Settings {
	pieceSize: number;
	numberOfPieces: number;
}

const drawPiece = (origin: Vector, deltaAngle: number) => {
	const context = useContext();
	const { pieceSize } = useSettings<Settings>();

	drawLine(origin, origin.copy().add(pieceSize));
	context.push();
	context.rotate(deltaAngle);
	drawLine(origin, origin.copy().add(pieceSize));
	context.pop();
};

export default create<Settings>({
	name: 'Pieza logo',
	autoClean: false,
	setup() {
		const context = useContext();
		const { numberOfPieces } = useSettings<Settings>();
		const { centerX, centerY } = useMeasures();
		const deltaAngle = 360 / numberOfPieces;

		context.strokeWeight(4);
		context.translate(centerX, centerY);
		context.angleMode(context.DEGREES);
		context.noFill();

		context.rotate(90 - deltaAngle);

		context.push();

		const randomPiece = Math.floor(context.random(4));
		for (let index = 0; index < numberOfPieces; index++) {
			context.rotate(deltaAngle);
			context.push();

			if (randomPiece === index) {
				context.translate(0, 50);
			}
			drawPiece(context.createVector(0, 0), deltaAngle);
			context.pop();
		}
		context.pop();
	},
	settings: {
		numberOfPieces: NumberValue({
			value: 5,
			label: 'Number of Pieces',
		}),
		pieceSize: NumberValue({
			value: 250,
			label: 'Piece Size',
		}),
	},
});
