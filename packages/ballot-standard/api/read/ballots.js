export default ({store}) => {
	const collection = store.get('ballots');
	return {
		'/ballots': getAllBallots(collection),
		'/ballots/:id': getBallotById(collection),
	};
};

export const getAllBallots = collection => async () => {
	return [null, await collection.all()];
};

export const getBallotById = collection => async id => {
	let ballot = await collection.find(id);
	if (!ballot) {
		return [{code: 404, message: 'No ballot found with the given id'}, null];
	}
	return [null, ballot];
};
