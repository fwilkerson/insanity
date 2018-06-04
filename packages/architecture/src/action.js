export function createActions(getState, actions) {
	let result = {};
	for (let i in actions) {
		result[i] = (...args) => handleAction(getState(), actions[i], ...args);
	}
	return result;
}

function handleAction(state, action, ...args) {
	if (typeof action.slice === 'string') {
		let keys = action.slice.split('.');
		let next = extend({}, state);
		let last = next;

		for (let i = 0, l = keys.length, temp; i < l; ++i) {
			temp = extend({}, last[keys[i]]);
			last = last[keys[i]] =
				i === l - 1 ? extend(temp, action(...args, temp)) : temp;
		}

		return next;
	}

	return extend({}, extend(state, action(...args, state)));
}

function extend(obj, props) {
	for (let i in props) obj[i] = props[i];
	return obj;
}
