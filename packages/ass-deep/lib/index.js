function assign(source, location, update) {}

function copy(obj, props) {
	for (let i in props) obj[i] = props[i];
	return obj;
}
