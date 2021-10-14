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
	return "rgb(" + intR + "," + intG + "," + intB + ")";
}