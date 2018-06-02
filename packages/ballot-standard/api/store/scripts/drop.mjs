import pg from 'pg';

export const dropBallotTable = async () => {
	let client = new pg.Client();
	await client.connect();
	await client.query(`drop table ballots;`);
	await client.end();
};
