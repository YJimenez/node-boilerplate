const webpack = require('webpack')
const path = require('path')

module.exports = {
	entry: [
		'./views/index.js',
    ],
	output: {
		path: __dirname + "/public",
		filename: 'bundle.js',
		publicPath: '/'
	},
	devServer: {
		historyApiFallback: true,
	},
	module:{
		loaders:[
			{
				test: /\.(jsx|js)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				}
			},
			{
				test: /(\.css)$/,
				loaders: ['style', 'css']
			},
		]
	}
};
