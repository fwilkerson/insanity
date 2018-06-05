import {count, isNullOrWhiteSpace} from '../util';

export default ({store}) => {
	const collection = store.get('ballots');
	return {
		CAST_BALLOT: castBallot(collection),
		CREATE_BALLOT: createBallot(collection),
	};
};

export const castBallot = collection => async command => {
	let {aggregateId, ...cmd} = command;

	if (isNullOrWhiteSpace(aggregateId)) {
		return validationError('Aggregate id cannot be null or empty');
	}

	if (!(await collection.has(aggregateId))) {
		return validationError('The given aggregate does not exist');
	}

	if (count(cmd.payload.selectedOptions) === 0) {
		return validationError('At least one option is required');
	}

	let event = await collection.publish(cmd, aggregateId);

	return [null, event];
};

export const createBallot = collection => async command => {
	let {question, options} = command.payload;

	if (isNullOrWhiteSpace(question) || count(question) > 256) {
		return validationError(
			'Question cannot be null, empty, or greater than 256 characters'
		);
	}

	if (count(options, x => !isNullOrWhiteSpace(x)) < 2) {
		return validationError('At least two options are required');
	}

	if (count(options, x => count(x) > 256) > 0) {
		return validationError('An option cannot be greater than 256 characters');
	}

	let event = await collection.publish(command);

	return [null, event];
};

function validationError(message) {
	return [{code: 400, message}, null];
}
