import pg from 'pg';

const pool = new pg.Pool({
	user: 'frankw1lk3rs0n',
	password: 'ir0nbars',
	database: 'ballot',
});

export function repository(collection) {
	return {
		all: async () => {
			let result = await pool.query({
				text: `SELECT * FROM ${collection}`,
			});
			return result.rows.map(forConsumption);
		},
		find: async aggregateId => {
			let result = await pool.query({
				text: `SELECT * FROM ${collection} WHERE aggregate_id = $1;`,
				values: [aggregateId],
			});
			return result.rows.map(forConsumption);
		},
		has: async aggregateId => {
			let result = await pool.query({
				text: `SELECT id FROM ${collection} WHERE aggregate_id = $1;`,
				values: [aggregateId],
			});
			return result.rows.length > 0;
		},
		publish: async (event, aggregateId) => {
			let queryConfig = {
				text: aggregateId
					? `INSERT INTO ${collection}(event, aggregate_id) VALUES($1, $2) RETURNING *`
					: `INSERT INTO ${collection}(event) VALUES($1) RETURNING *`,
				values: aggregateId ? [event, aggregateId] : [event],
			};

			let result = await pool.query(queryConfig);
			return result.rows.map(forConsumption)[0];
		},
	};
}

function forConsumption(row) {
	return {
		aggregateId: row.aggregate_id,
		createdAt: row.created_at,
		event: row.event,
	};
}
