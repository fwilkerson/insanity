import {repository} from './data';

const collections = new Map([['ballots', repository('ballots')]]);

export async function createStore() {
	return {
		get: key => collections.get(key),
	};
}
