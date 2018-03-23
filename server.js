import React from 'react'
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from './views/app.js'

import express from 'express'
const app = express()

const io = require('socket.io')()

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';

var shell = require('shelljs');
var fs = require('fs');

var bodyParser = require('body-parser')
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( express.static('public') )

require('events').EventEmitter.prototype._maxListeners = 0;

io.on('connection', (socket) => {
		console.log("Socket connected");

		socket.on('subscribeToTimer', (interval) => {
				console.log('Subscribe to client ');
				socket.emit('timer', "+-= Server Ready =-+");
		});

});

app.post('/runTestCases', (req, res) => {

		const variables = [
				'-DconnUiName=TC-' + Date.now(),
				'-Dbrowser=chrome',
				'-Dheadless=' + false,
				'-Denvironment=' + req.body.environment,
				'-Dlocale=' + req.body.storefront,
				'-DcodeShare=' + req.body.codeShare,
				'-Dparted=' + req.body.origin,
				'-Darrived=' + req.body.destination
		];

		const { spawn } = require('child_process');

		var mvncmd = "mvn clean test -Dtest=" + req.body.testType +
		" -DargLine='" + variables.join(' ').toString() + "'";

		const child = spawn(mvncmd, {
				cwd:'../navigation',
				detached: false,
				shell: true,
		});

		child.stdout.setEncoding('utf8')
		child.stdout.on('data', (data) => {

				const javaLog = data.split('+-=').pop().split('=-+').shift();
				console.log("(Java Console) " + javaLog);

				//if( data.indexOf("+-=") !== -1 ){
						io.sockets.emit('timer', "(Java Console) " + data);
				//}

		});

		child.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
		});

		child.on('close', (code) => {
			res.send(JSON.stringify({ status: "finished"  }))
			console.log(`child process exited with code ${code}`);
		});

});

app.post('/jsonJavaResponse', (req, res) => {
		console.log(req.body);
		const testSchema = {
			name: req.body.name,
			params: {
				environment: req.body.environment,
				origin: req.body.origin,
				destination: req.body.destination,
				storefront: req.body.storefront,
				codeShare: req.body.codeShare,
			},
			response: {
				date: req.body.date,
				details: req.body.details
			}
		}

		MongoClient.connect( url, ( err, db ) =>{
				if ( err ) throw err;
				const dbConn = db.db('AMtestCases')
				dbConn.collection('testSchemas').insertOne(testSchema)
				db.close();
				console.log("schema inserted");
		})

		/*
			fs.writeFile("public/endpoint.json", JSON.stringify(testSchema), (err) => {
	    if (err) {
	        console.error(err);
	        return;
	    };
			    console.log("File has been created");
			});
		*/

		res.send(JSON.stringify({ status: "finished" }))
		console.log(':_:_:_:_:_:_:_:_: JAVA JSON REQUEST :_:_:_:_:_:_:_:_:_:');
});

app.post('/getMongoData', (req, res) => {
		MongoClient.connect( url, ( err, db ) => {

				if ( err ) throw err;
				const dbConn = db.db('AMtestCases')

				dbConn.collection('testSchemas').find({}).sort( { "name": -1 } )
					.toArray( (err, result) => {
						if ( err ) throw err;
						res.send(JSON.stringify({ result }))
				});
				db.close();

				console.log("Mongo data sent");
		})
})

app.post('/getOneCaseParams', (req, res) => {
		MongoClient.connect( url, ( err, db ) => {
				if ( err ) throw err;
				const dbConn = db.db('AMtestCases')
				dbConn.collection('testSchemas')
						.findOne({ name: req.body.name }, (err, result) => {
								if (err) throw err;
								db.close();
								res.send(JSON.stringify({ result }))
						});
				console.log("Params for one case sent");
		})
})

app.get('*', function(req, res){

		let context={}

		let htmlBody = renderToString(
			<StaticRouter location={req.url} context={context}>
					<App />
			</StaticRouter>
		);

		let htmlFrame = `<html>
				<head>
					<title>AM Test Cases</title>
					<link rel='stylesheet' href='/style.css' />
					<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
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

const PORT = 8080;
const PORT_IO = 8081;
io.listen(PORT_IO);
app.listen(PORT, () => {
		console.log('http://localhost:' + PORT);
})
