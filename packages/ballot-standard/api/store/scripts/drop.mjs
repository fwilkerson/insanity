import pg from 'pg';

(async () => {
	let client = new pg.Client({
		user: 'frankw1lk3rs0n',
		password: 'ir0nbars',
		database: 'ballot',
	});

	await client.connect();

	let res = await client.query(`drop table ballots;`);

	console.info(res);
	process.exit(0);
})();
