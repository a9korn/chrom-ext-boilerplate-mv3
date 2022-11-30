const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./webpack/webpack.base.config');
const devConfig = require('./webpack/webpack.dev.config');

module.exports = (_, {mode}) => {
	const isDev = mode !== 'production';

	const config = isDev ? {...baseConfig, ...devConfig} : {...baseConfig};

	config.plugins.unshift(
		new HtmlWebpackPlugin({
			filename: 'popup.html',
			template: path.resolve(__dirname, 'src/Popup/popup.html'),
			minify: !isDev,
			chunks: ['popup'],
		}),
	);

	return config;
};
