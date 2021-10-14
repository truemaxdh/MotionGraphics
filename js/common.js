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

class Vector2D {
	constructor(v1, v2) {
		this.v1 = v1;
		this.v2 = v2;
	}
	
	Create(v) {
		return new Vector2D(v.v1, v.v2);
	}
	
	clone() {
		return new Vector2D(this.v1, this.v2);
	}
	
	magnitude() {
		return Math.hypot(this.v1, this.v2);
	}
	
	unitVector() {
		let mag = this.magnitude();
		return {v1:this.v1 / mag, v2: this.v2 / mag};
	}
	
	add(v) {
		this.v1 += v.v1;
		this.v2 += v.v2;
	}
	
	subtract(v) {
		this.v1 -= v.v1;
		this.v2 -= v.v2;
	}
	
	multiply1D(n) {
		this.v1 *= n;
		this.v2 *= n;
	}
	
	calcDist(v) {
		return Math.hypot(this.v1 - v.v1, this.v2 - v.v2);
	}
}
