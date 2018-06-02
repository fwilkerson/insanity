import pg from 'pg';

// TODO: Add an index to aggregate_id
(async () => {
	let client = new pg.Client({
		user: 'frankw1lk3rs0n',
		password: 'ir0nbars',
		database: 'ballot',
	});

	await client.connect();

	let res = await client.query(`create table ballots(
        id serial PRIMARY KEY,
        aggregate_id uuid NOT NULL DEFAULT uuid_generate_v4(),
        created_at timestamp NOT NULL DEFAULT current_timestamp,
        event json NOT NULL
    );`);

	console.info(res);
	process.exit(0);
})();
