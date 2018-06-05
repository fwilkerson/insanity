import pg from 'pg';

// TODO: Add an index to aggregate_id
export const createBallotTable = async () => {
	let client = new pg.Client();
	await client.connect();
	await client.query(`create table ballots(
        id serial PRIMARY KEY,
        aggregate_id uuid NOT NULL DEFAULT uuid_generate_v4(),
        created_at timestamp NOT NULL DEFAULT current_timestamp,
        event json NOT NULL
    );`);
	await client.end();
};
