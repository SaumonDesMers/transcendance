import { Vec2, Rect } from './gameData';

export function computeShadowPolygone(rect: Rect, light: Vec2): Array<Vec2> {
	// cast rays from light to each obstacle corner
	let lightToCornerRays: Array<Vec2> = [
		new Vec2(rect.pos.x, rect.pos.y).sub(light),
		new Vec2(rect.pos.x + rect.width, rect.pos.y).sub(light),
		new Vec2(rect.pos.x + rect.width, rect.pos.y + rect.height).sub(light),
		new Vec2(rect.pos.x, rect.pos.y + rect.height).sub(light),
	];

	// find the duo of rays with the largest angle between them
	let maxAngle = 0;
	let maxAngleRays: Array<Vec2> = [];
	for (let i = 0; i < lightToCornerRays.length; i++) {
		let ray1 = lightToCornerRays[i];
		for (let j = i + 1; j < lightToCornerRays.length; j++) {
			let ray2 = lightToCornerRays[j];
			let angle = ray1.angleTo(ray2);
			if (angle > maxAngle) {
				maxAngle = angle;
				maxAngleRays = [ray1, ray2];
			}
		}
	}

	// get the corners corresponding to the rays with largest angle
	let maxAngleCorners = maxAngleRays.map(ray => light.add(ray));

	// get points off screen that are on the same line as the rays with the largest angle
	let maxAngleOffScreenPoints = maxAngleRays.map(ray => ray.normed(900).add(light));

	// compile points and corners into one array which will define the polygon of the shadow
	return [...maxAngleCorners.reverse(), ...maxAngleOffScreenPoints];
}
