import {resolve} from 'path';

import {buildCommandRouter, buildQueryRouter, send} from './lib';
import {createStore} from './store';

export default async () => {
	let options = {store: await createStore()};
	let [queryRouter, commandRouter] = await Promise.all([
		buildQueryRouter(resolve('./api/read'), options),
		buildCommandRouter(resolve('./api/write'), options),
	]);

	return (request, response) => {
		response.setHeader('Content-Type', 'application/json; charset=utf-8');
		switch (request.method) {
			case 'GET':
				queryRouter(request, response);
				break;
			case 'POST':
				commandRouter(request, response);
				break;
			default:
				send(response, 404, {code: 404, message: 'Not Found'});
				break;
		}
	};
};
