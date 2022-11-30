const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = require('./env');

module.exports = {
	entry: {
		[env.BACKGROUND]: ['./src/Background/index.ts'],
		[env.CONTENT]: ['./src/Content/index.ts'],
		popup: ['./src/Popup/index.tsx'],
	},
	output: {
		path: path.resolve(path.dirname(__dirname), 'dist'),
		filename: '[name].bundle.js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /.s?css$/,
				exclude: /node_modules/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(path.dirname(__dirname), 'public'),
					to: path.resolve(path.dirname(__dirname), 'dist'),
				},
			],
		}),
		new MiniCssExtractPlugin(),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
};
