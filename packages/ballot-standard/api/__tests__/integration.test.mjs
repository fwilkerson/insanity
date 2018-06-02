process.env.PGUSER = 'integration_tests';
process.env.PGDATABASE = 'ballot_standard_test';
process.env.PGPASSWORD = 'password';

import request from 'supertest';
import test from 'tape';

import initialize from '..';
import {closeConnection} from '../store/data';
import {createBallotTable} from '../store/scripts/create';
import {dropBallotTable} from '../store/scripts/drop';
import {seedBallotTable} from '../store/scripts/seed';

let app;
let aggregateId;

test('integration: setup', async tap => {
	await createBallotTable();
	aggregateId = await seedBallotTable();
	app = await initialize();
	tap.pass('integration setup succeeded');
	tap.end();
});

test('integration: GET /ballots/:id failure', tap => {
	request(app)
		.get('/ballots/ca66cdb3-05fb-4b97-8e2c-62cfc6cbd295')
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 404, 'response has proper 404 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: GET /ballots/:id', tap => {
	request(app)
		.get('/ballots/' + aggregateId)
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 200, 'response has proper 200 status');
			let data = response.body;
			tap.assert(
				data.aggregateId && data.createdAt && data.event,
				'data has proper shape'
			);
			tap.end();
		});
});

test('integration: GET /ballots', tap => {
	request(app)
		.get('/ballots')
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 200, 'response has proper 200 status');
			tap.assert(Array.isArray(response.body), 'response body is an array');
			let data = response.body[0];
			tap.assert(
				data.aggregateId && data.createdAt && data.event,
				'data has proper shape'
			);
			tap.end();
		});
});

test('integration: POST /command validation failure', tap => {
	request(app)
		.post('/command')
		.send({
			type: 'CREATE_BALLOT',
			payload: {
				question: 'Should I mock the database or do the full integration?',
				options: [],
			},
		})
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 400, 'response has proper 400 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: POST /command', tap => {
	request(app)
		.post('/command')
		.send({
			type: 'CREATE_BALLOT',
			payload: {
				question: 'Should I mock the database or do the full integration?',
				options: ['Just the request', 'Full integration'],
			},
		})
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 202, 'response has proper 202 status');
			let data = response.body;
			tap.assert(
				data.aggregateId && data.createdAt && data.event,
				'data has proper shape'
			);
			tap.end();
		});
});

test('integration: POST /command references another aggregate', tap => {
	request(app)
		.post('/command')
		.send({
			aggregateId,
			type: 'CAST_BALLOT',
			payload: {selectedOptions: ['cyan']},
		})
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 202, 'response has proper 202 status');
			let data = response.body;
			tap.assert(
				data.aggregateId && data.createdAt && data.event,
				'data has proper shape'
			);
			tap.end();
		});
});

test('integration: teardown', async tap => {
	await dropBallotTable();
	await closeConnection();
	tap.pass('integration teardown succeeded');
	tap.end();
});

// These are tests for ensuring catastrophic failures are handled

test('integration: GET /ballots failure', tap => {
	request(app)
		.get('/ballots')
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 500, 'response has proper 500 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: POST /command failure', tap => {
	request(app)
		.post('/command')
		.send({
			type: 'CREATE_BALLOT',
			payload: {
				question: 'Should I mock the database or do the full integration?',
				options: ['Just the request', 'Full integration'],
			},
		})
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 500, 'response has proper 500 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: POST /command invalid command shape', tap => {
	request(app)
		.post('/command')
		.send({type: 'CREATE_BALLOT'})
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 400, 'response has proper 400 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: POST /command no command', tap => {
	request(app)
		.post('/command')
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 400, 'response has proper 400 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: GET unsupported route', tap => {
	request(app)
		.get('/unsupported')
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 404, 'response has proper 404 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: POST unsupported route', tap => {
	request(app)
		.post('/unsupported')
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 404, 'response has proper 404 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});

test('integration: unsupported HTTP verb', tap => {
	request(app)
		.put('/command')
		.expect('Content-Type', /json/)
		.end((err, response) => {
			tap.assert(response.status === 404, 'response has proper 404 status');
			let data = response.body;
			tap.assert(data.message, 'data has proper shape');
			tap.end();
		});
});
