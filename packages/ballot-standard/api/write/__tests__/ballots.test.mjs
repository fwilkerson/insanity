import test from 'tape';

import {castBallot, createBallot} from '../ballots';

let fake = {id: 1, aggregateId: 'some-id', createdAt: Date.now()};

let collection = {
	publish: async event => {
		return {...fake, event};
	},
	has: async aggregateId => {
		return aggregateId === fake.aggregateId;
	},
};

test('castBallot: No aggregate id', async tap => {
	let command = {
		aggregateId: undefined,
		type: 'CAST_BALLOT',
		payload: {
			selectedOptions: ['a selected option'],
		},
	};

	let [error, result] = await castBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');
	tap.end();
});

test('castBallot: Aggregate does not exist', async tap => {
	let command = {
		aggregateId: 'wrong-id',
		type: 'CAST_BALLOT',
		payload: {
			selectedOptions: ['a selected option'],
		},
	};

	let [error, result] = await castBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');
	tap.end();
});

test('castBallot: No selected options', async tap => {
	let command = {
		aggregateId: 'some-id',
		type: 'CAST_BALLOT',
		payload: {
			selectedOptions: [],
		},
	};

	let [error, result] = await castBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');
	tap.end();
});

test('castBallot: Success', async tap => {
	let command = {
		aggregateId: 'some-id',
		type: 'CAST_BALLOT',
		payload: {
			selectedOptions: ['a selected option'],
		},
	};

	let [error, result] = await castBallot(collection)(command);

	tap.assert(error === null, 'error is null');
	tap.isEquivalent(
		result,
		{
			...fake,
			event: {
				type: 'CAST_BALLOT',
				payload: {
					selectedOptions: ['a selected option'],
				},
			},
		},
		'the command is published'
	);

	tap.end();
});

test('createBallot: No question', async tap => {
	let command = {
		type: 'CREATE_BALLOT',
		payload: {
			question: undefined,
			options: ['a valid option', 'another valid option'],
		},
	};
	let [error, result] = await createBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');
	tap.end();
});

test('createBallot: Invalid question', async tap => {
	let command = {
		type: 'CREATE_BALLOT',
		payload: {
			question:
				'exceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256characters',
			options: ['a valid option', 'another valid option'],
		},
	};
	let [error, result] = await createBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');

	tap.end();
});

test('createBallot: No options', async tap => {
	let command = {
		type: 'CREATE_BALLOT',
		payload: {
			question: 'a valid question',
			options: [],
		},
	};
	let [error, result] = await createBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');

	tap.end();
});

test('createBallot: Invalid number of options', async tap => {
	let command = {
		type: 'CREATE_BALLOT',
		payload: {
			question: 'a valid question',
			options: ['a valid option'],
		},
	};
	let [error, result] = await createBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');

	tap.end();
});

test('createBallot: Invalid options', async tap => {
	let command = {
		type: 'CREATE_BALLOT',
		payload: {
			question: 'a valid question',
			options: [
				'a valid option',
				'another valid option',
				'exceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256charactersexceeds256characters',
			],
		},
	};
	let [error, result] = await createBallot(collection)(command);

	tap.assert(error.code === 400, 'error has proper 400 status');
	tap.assert(
		typeof error.message === 'string' && error.message.length > 0,
		'error has a message'
	);
	tap.assert(result === null, 'result is null');

	tap.end();
});

test('createBallot: Success', async tap => {
	let command = {
		type: 'CREATE_BALLOT',
		payload: {
			question: 'a valid question',
			options: ['a valid option', 'another valid option'],
		},
	};
	let [error, result] = await createBallot(collection)(command);

	tap.assert(error === null, 'error is null');
	tap.isEquivalent(
		result,
		{...fake, event: command},
		'the command is published'
	);

	tap.end();
});
