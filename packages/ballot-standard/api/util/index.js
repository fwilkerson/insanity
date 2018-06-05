export function count(iterable, predicate) {
	if (predicate === undefined || typeof iterable === 'string') {
		return iterable.length;
	}
	return iterable.filter(predicate).length;
}

export function isNullOrWhiteSpace(str) {
	return str === null || str === undefined || str.trim() === '';
}
