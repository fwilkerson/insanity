export function createStore(state) {
	let subs = [];
	state = state || {};

	function removeListener(listener) {
		let next = [];
		for (let i = 0, l = subs.length; i < l; ++i) {
			listener === subs[i] ? (listener = null) : next.push(subs[i]);
		}
		subs = next;
	}

	return {
		getState: () => state,
		setState: next => {
			if (state === next) return;
			state = next;
			let current = subs;
			for (let i = 0, l = current.length; i < l; ++i) current[i](state);
		},
		subscribe: listener => {
			subs.push(listener);
			return () => removeListener(listener);
		},
	};
}
