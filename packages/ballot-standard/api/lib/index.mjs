import fs from 'fs';
import matchit from 'matchit';
import path from 'path';
import getRawBody from 'raw-body';

export async function buildCommandRouter(directory, options) {
	let i = 0;
	let imports = [];

	let files = await getDirectory(directory);
	while (i < files.length) {
		if (!files[i].includes('__tests__')) {
			imports.push(import(path.join(directory, files[i])));
		}
		i++;
	}

	let handlers = (await Promise.all(imports)).reduce(
		(acc, next) => ({...acc, ...next.default(options)}),
		{}
	);
	return async (request, response) => {
		try {
			if (request.url !== '/command') {
				throw createError(404, 'Not Found');
			}

			let command = await validateCommand(request);

			let [error, result] = await handlers[command.type](command);

			if (error) {
				return send(response, error.code, error);
			}

			send(response, 202, result);
		} catch (err) {
			let code = err.statusCode || err.status;
			let message = code ? err.message : 'Internal Server Error';
			send(response, code || 500, {message});
		}
	};
}

export async function buildQueryRouter(directory, options) {
	let i = 0;
	let imports = [];

	let files = await getDirectory(directory);
	while (i < files.length) {
		if (!files[i].includes('__tests__')) {
			imports.push(import(path.join(directory, files[i])));
		}
		i++;
	}

	let handlers = (await Promise.all(imports)).reduce(
		(acc, next) => ({...acc, ...next.default(options)}),
		{}
	);
	let routes = Object.keys(handlers).map(matchit.parse);

	return async (request, response) => {
		try {
			let matches = matchit.match(request.url, routes);

			if (matches.length === 0) {
				throw createError(404, 'Not Found');
			}

			let params = matchit.exec(request.url, matches);
			let [error, result] = await handlers[matches[0].old](
				...Object.keys(params).map(key => params[key])
			);

			if (error) {
				return send(response, error.code, error);
			}

			send(response, 200, result);
		} catch (err) {
			let code = err.statusCode || err.status;
			let message = code ? err.message : 'Internal Server Error';
			send(response, code || 500, {message});
		}
	};
}

function createError(code, message) {
	let error = new Error(message);
	error.status = code;
	return error;
}

function getDirectory(directory) {
	return new Promise(res => fs.readdir(directory, (err, files) => res(files)));
}

async function parse(request) {
	let buffer = await getRawBody(request);
	return JSON.parse(buffer.toString());
}

export function send(response, code, data) {
	let body = JSON.stringify(data);
	response.setHeader('Content-Length', Buffer.byteLength(body));
	response.statusCode = code;
	response.end(body);
}

async function validateCommand(request) {
	try {
		let command = await parse(request);
		if (command.hasOwnProperty('type') && command.hasOwnProperty('payload')) {
			return command;
		}
	} catch (err) {}

	throw createError(400, 'Invalid Command');
}
