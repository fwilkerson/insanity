import fs from 'fs';
import matchit from 'matchit';
import path from 'path';

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
				return send(response, 404, {code: 404, message: 'Not Found'});
			}

			let body = await parse(request);
			let validationError = validateCommand(body);

			if (validationError) {
				return send(response, validationError.code, validationError);
			}

			let [error, result] = await handlers[body.type](body);

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
				return send(response, 404, {code: 404, message: 'Not Found'});
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

function getDirectory(directory) {
	return new Promise(res => fs.readdir(directory, (err, files) => res(files)));
}

function parse(request) {
	return new Promise((resolve, reject) => {
		let body = [];
		request
			.on('error', err => {
				reject(err);
			})
			.on('data', chunk => {
				body.push(chunk);
			})
			.on('end', () => {
				let data = Buffer.concat(body).toString();
				resolve(JSON.parse(data));
			});
	});
}

export function send(response, code, data) {
	let body = JSON.stringify(data);
	response.setHeader('Content-Length', Buffer.byteLength(body));
	response.statusCode = code;
	response.end(body);
}

function validateCommand(command) {
	try {
		if (command.hasOwnProperty('type') && command.hasOwnProperty('payload')) {
			return null;
		}
	} catch (err) {
		let code = err.statusCode || err.status;
		return {
			code: code || 400,
			message: code ? err.message : 'Invalid command',
		};
	}
}
