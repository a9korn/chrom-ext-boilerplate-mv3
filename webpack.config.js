const baseConfig = require('./webpack/webpack.base.config');
const devConfig = require('./webpack/webpack.dev.config');

module.exports = (_, {mode}) => {
	const isDev = mode !== 'production';

	const config = isDev ? {...baseConfig, ...devConfig} : {...baseConfig};

	return config;
};
