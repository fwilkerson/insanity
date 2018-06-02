import pg from 'pg';

(async () => {
	let client = new pg.Client({
		user: 'frankw1lk3rs0n',
		password: 'ir0nbars',
		database: 'ballot',
	});

	await client.connect();

	let event = JSON.stringify({
		type: 'CREATE_BALLOT',
		payload: {
			question: `Which color?`,
			options: ['cyan', 'magenta', 'olive'],
		},
	});

	let res = await client.query({
		text: `INSERT INTO ballots(event) VALUES($1) RETURNING *`,
		values: [event],
	});

	console.info(res.rows[0]);
	process.exit(0);
})();
