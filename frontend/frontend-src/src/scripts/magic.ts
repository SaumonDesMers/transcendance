import { Vec2, Rect } from './utils';

export function computeShadowPolygone(rect: Rect, light: Vec2): Array<Vec2> {
	let corners: Array<Vec2> = [
		new Vec2(rect.pos.x, rect.pos.y),
		new Vec2(rect.pos.x + rect.width, rect.pos.y),
		new Vec2(rect.pos.x + rect.width, rect.pos.y + rect.height),
		new Vec2(rect.pos.x, rect.pos.y + rect.height),
	];

	// cast rays from light to each corner
	let lightToCornerRays: Array<Vec2> = [];
	for (let corner of corners)
		lightToCornerRays.push(corner.sub(light));

	// sort rays by angle
	lightToCornerRays.sort((a, b) => a.angle - b.angle);
	// get ray with smallest and largest angle
	let minAngleRay = lightToCornerRays[0];
	let maxAngleRay = lightToCornerRays[lightToCornerRays.length - 1];

	// sort rays by length
	lightToCornerRays.sort((a, b) => a.length - b.length);
	// get smallest ray
	let smallestRay = lightToCornerRays[0];


	// get the min and max angle corners
	let minAngleCorner = light.add(minAngleRay);
	let maxAngleCorner = light.add(maxAngleRay);

	// get the closest corner from the light
	let closestCorner = light.add(smallestRay);


	// get points off screen that are on the same line as the rays with smallest and largest angle
	let minAngleOffScreenPoint = minAngleRay.normed(900).add(light);
	let maxAngleOffScreenPoint = maxAngleRay.normed(900).add(light);

	// get point off screen that are on the same line as the smallest ray
	let smallestRayOffScreenPoint = smallestRay.normed(900).add(light);

	// compile points and corners into one array which will define the polygon of the shadow
	return [
		minAngleCorner,
		minAngleOffScreenPoint,
		smallestRayOffScreenPoint,
		maxAngleOffScreenPoint,
		maxAngleCorner,
		closestCorner,
	];
}