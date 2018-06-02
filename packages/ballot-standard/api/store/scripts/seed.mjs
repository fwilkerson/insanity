import pg from 'pg';

export const seedBallotTable = async () => {
	let client = new pg.Client();
	await client.connect();
	let {rows} = await client.query({
		text: `INSERT INTO ballots(event) VALUES($1) RETURNING *`,
		values: [
			JSON.stringify({
				type: 'CREATE_BALLOT',
				payload: {
					question: `Which color?`,
					options: ['cyan', 'magenta', 'olive'],
				},
			}),
		],
	});
	await client.end();
	return rows[0].aggregate_id;
};
