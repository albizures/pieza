import { useContext } from 'pieza';
import { Vector } from 'p5';

const drawPoint = (point: Vector) => {
	const context = useContext();
	context.point(point.x, point.y, point.z);
};

const drawLine = (start: Vector, end: Vector) => {
	const context = useContext();
	context.line(start.x, start.y, start.z, end.x, end.y, end.z);
};

export { drawLine, drawPoint };
