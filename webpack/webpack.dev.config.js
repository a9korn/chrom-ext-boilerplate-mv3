const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const env = require('./env');
const baseConfig = require('./webpack.base.config');

module.exports = {
	entry: {
		...baseConfig.entry,
		[env.BACKGROUND]: [`./webpack/${env.BACKGROUND_CLIENT}`, ...baseConfig.entry[env.BACKGROUND]],
		[env.CONTENT]: [`./webpack/${env.CONTENT_CLIENT}`, ...baseConfig.entry[env.CONTENT]],
	},
	devtool: 'inline-cheap-module-source-map',
	optimization: {
		minimizer: [
			new CssMinimizerPlugin(),
		],
	},
	devServer: {
		port: env.PORT,
		hot: false,
		liveReload: false,
		static: [
			path.resolve(__dirname, 'src/Content'),
			path.resolve(__dirname, 'src/Background'),
		],
		setupMiddlewares(middlewares, devServer) {
			middlewares.push({
				name: env.NAME,
				path: `/${env.NAME}`,
				middleware(req, res) {
					res.setHeader('Cache-Control', 'no-cache');
					res.setHeader('Content-Type', 'text/event-stream');
					res.setHeader('Access-Control-Allow-Origin', '*');
					res.setHeader('Connection', 'keep-alive');
					res.flushHeaders(); // flush the headers to establish SSE with client

					let closed = false;
					devServer.compiler.hooks.done.tap(env.NAME, stats => {
						if (closed) {
							return;
						}

						const compiledNames = stats
							.toJson({all: false, modules: true})
							.modules.filter(i => i.name !== undefined)
							.map(i => i.name);
						const compiledChunks = stats
							.toJson()
							.modules.filter(i => compiledNames.includes(i.name))
							.map(i => i.chunks)
							.reduce((previousValue, currentValue) => previousValue.concat(currentValue), []);
						const isContentScriptsUpdated
                  = !stats.hasErrors() && compiledChunks.some(chunk => env.CONTENT.includes(chunk));
						const isBackgroundUpdated
                  = !stats.hasErrors() && compiledChunks.some(chunk => env.BACKGROUND.includes(chunk));
						let data;
						if (isContentScriptsUpdated) {
							data = {type: 'contentScriptUpdates'};
						} else if (isBackgroundUpdated) {
							data = {type: 'backgroundUpdates'};
						}

						if (data) {
							res.write(`data: ${JSON.stringify(data)}\n\n`);
							// Call `res.flush()` to actually write the data to the client.
							// See https://github.com/expressjs/compression#server-sent-events for details.
							res.flush();
						}
					});
					res.on('close', () => {
						closed = true;
						res.end();
					});
				},
			});
			return middlewares;
		},
		devMiddleware: {
			writeToDisk: true,
		},
	},
	watchOptions: {
		ignored: /node_modules/,
	},
};
