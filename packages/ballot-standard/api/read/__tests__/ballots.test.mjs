import test from 'tape';

import {getBallotById} from '../ballots';

let collection = {
	find: async id => {
		let events = [{id: 1}];
		return events.find(x => x.id === id);
	},
};

test('getBallotById: No result found', async tap => {
	let [error, result] = await getBallotById(collection)(-1);

	tap.assert(error.code === 404, 'error has a proper 404 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');

	tap.end();
});

test('getBallotById: Result found', async tap => {
	let ballotId = 1;
	let [error, result] = await getBallotById(collection)(ballotId);

	tap.assert(error === null, 'error is null');
	tap.assert(result.id === ballotId, 'result id matches');

	tap.end();
});
