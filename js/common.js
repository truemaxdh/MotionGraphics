const getRndInt = function(base, variation) {
	return parseInt(base + Math.random() * variation);
}

const prune = function(val, min, max) {
	if (val < min) val = min;
	if (val > max) val = max;
	return val;
}

const getRndColor = function(baseR, baseG, baseB, variation) {
	return getRGBStr(
		prune(getRndInt(baseR, variation), 0, 255),
		prune(getRndInt(baseG, variation), 0, 255),
		prune(getRndInt(baseB, variation), 0, 255)
	);
}

const getRGBStr = function(intR, intG, intB) {
	return "rgb(" + prune(intR, 0, 255) + "," + prune(intG, 0, 255) + "," + prune(intB, 0, 255) + ")";
}

/**
 * 
 * @param mass : [mass1, mass2] 
 * @param velocity : [velocity1, velocity2]
 * 
 * return : [newVelocity1, newVelocity2]
 */
const elasticCollision = function(mass, velocity) {
	let newVelo1 = ((mass[0] - mass[1]) * velocity[0] + 2 * mass[1] * velocity[1]) / (mass[0] + mass[1]);
	let newVelo2 = (2 * mass[0] * velocity[0] + (mass[1] - mass[0]) * velocity[1]) / (mass[0] + mass[1]);
	return [newVelo1, newVelo2];
}
class Vector2D {
	constructor(v1, v2) {
		this.v1 = v1;
		this.v2 = v2;
	}
		
	clone() {
		return new Vector2D(this.v1, this.v2);
	}
	
	magnitude() {
		return Math.hypot(this.v1, this.v2);
	}
	
	unitVector() {
		let mag = this.magnitude();
		return this.clone().multiply1D(1 / mag);
	}
	
	theta() {
		return Math.atan2(this.v2, this.v1);
	}
	
	rotate(theta) {
		let mag = this.magnitude();
		let newTheta = this.theta() + theta;
		this.v1 = Math.cos(newTheta) * mag;
		this.v2 = Math.sin(newTheta) * mag;
		return this;
	}
	
	add(v) {
		this.v1 += v.v1;
		this.v2 += v.v2;
		return this;
	}
	
	subtract(v) {
		this.v1 -= v.v1;
		this.v2 -= v.v2;
		return this;
	}
	
	multiply1D(n) {
		this.v1 *= n;
		this.v2 *= n;
		return this;
	}
	
	calcDist(v) {
		return Math.hypot(this.v1 - v.v1, this.v2 - v.v2);
	}
}
