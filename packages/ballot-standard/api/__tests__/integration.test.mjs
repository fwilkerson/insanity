import request from 'supertest';
import test from 'tape';

import initialize from '..';

let app;

test('integration: Setup', async tap => {
	app = await initialize();

	tap.assert(app !== null, 'app initialized');

	tap.end();
});

test('integration: Welcome page', tap => {
	request(app)
		.get('/')
		.end((err, response) => {
			tap.assert(err === null, 'error is null');
			tap.assert(response.status === 404, 'response has proper 404 status');

			tap.end();
		});
});

test('integration: /ballots', tap => {
	request(app)
		.get('/ballots')
		.end((err, response) => {
			tap.assert(err === null, 'error is null');
			tap.assert(response.status === 500, 'response has proper 500 status');

			tap.end();
		});
});
