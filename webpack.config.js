const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		background: './src/Background/index.ts',
		content: './src/Content/index.ts',
		// Popup: './src/Popup/index.tsx',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/i,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'public'),
					to: path.resolve(__dirname, 'dist'),
				},
			],
		}),
		new HtmlWebpackPlugin({
			filename: 'popup.html',
			template: path.resolve(__dirname, 'src/Popup/popup.html'),
			minify: true,
			chunks: ['popup'],
		}),

	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
};
