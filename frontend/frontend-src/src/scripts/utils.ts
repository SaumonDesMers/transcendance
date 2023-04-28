export class Vec2 {
	
	constructor(public x: number, public y: number) {}

	set(length: number, angle: number) {
		this.x = length * Math.cos(angle);
		this.y = length * Math.sin(angle);
	}

	copy(): Vec2 { return new Vec2(this.x, this.y); }

	add(other: Vec2): Vec2 { return new Vec2(this.x + other.x, this.y + other.y); }
	sub(other: Vec2): Vec2 { return new Vec2(this.x - other.x, this.y - other.y); }
	mul(scalar: number): Vec2 { return new Vec2(this.x * scalar, this.y * scalar); }
	div(scalar: number): Vec2 { return new Vec2(this.x / scalar, this.y / scalar); }
	dot(other: Vec2): number { return this.x * other.x + this.y * other.y; }
	normed(length: number): Vec2 { return this.normalized.mul(length); }
	get length(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
	get normalized(): Vec2 { return this.div(this.length); }
	get angle(): number { return Math.atan2(this.y, this.x); }

	angleTo(other: Vec2): number {
		return Math.acos(this.dot(other) / (this.length * other.length));
	}

}

export class Rect {
	pos: Vec2;
	width: number;
	height: number;
}