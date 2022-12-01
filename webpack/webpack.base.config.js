const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const env = require('./env');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
		new HtmlWebpackPlugin({
			filename: 'popup.html',
			template: path.resolve(__dirname, '../src/Popup/popup.html'),
			chunks: ['popup'],
		}),
		new MiniCssExtractPlugin(),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	optimization: {
		minimizer: [
			new TerserPlugin(),
			new CssMinimizerPlugin(),
		],
		minimize: true,
	},
};
