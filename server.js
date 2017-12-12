import React from 'react'
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
global.navigator = { userAgent: 'all' };

import App from './views/app.jsx'

import express from 'express'
const app = express()

app.use( express.static('public') )

app.get('*', function(req, res){

	let context={}

	let htmlBody = renderToString(
		<StaticRouter location={req.url} context={context}>
			<MuiThemeProvider >
				<App />
			</MuiThemeProvider>
		</StaticRouter>
	);

	let htmlFrame = `<html>
			<head>
				<title>Görli Pass</title>
				<link rel='stylesheet' href='/style.css' />
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body>
				<div id="app">${htmlBody}</div>
				<script src="/bundle.js"></script>
			</body>
		</html>`

	if(context.status >= 400) {
		res.status(context.status).send(htmlFrame);
	} else if (context.url) {
		res.redirect(context.status, context.url);
	} else {
		res.send(htmlFrame);
	}

})

var PORT = 8080;
app.listen(PORT, () => {
	console.log('http://localhost:' + PORT);
})
