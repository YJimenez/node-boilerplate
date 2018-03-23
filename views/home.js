import React, { Component } from 'react'
import { BarLoader } from 'react-spinners'
import { subscribeToTimer } from './socketio'

import RunTestBar from './runTestBar'

export default class Home extends Component {

	constructor(props) {
		super(props);

		this.initialState = {
			dataTable:[],
			value: "",
			testType: "OnewayNavigationTest",
			storefront: "es-mx",
			codeShare: "false",
			origin:"AGU",
			destination:"CUN",
			environment:"RC",
			status: "stopped",
			consolePanel: false,
			javaLog: "",
			javaLogComplete: ""
		};

		this.state = this.initialState;

		subscribeToTimer((err, javaLogComplete) => {
			let javaLog = "";

			if( javaLogComplete.indexOf("+-=") !== -1 ){

					javaLog = javaLogComplete.split('+-=').pop().split('=-+').shift();

					this.setState({
						javaLog,
						javaLogComplete: "(Java Console) " + javaLog
					})
			} else {
					this.setState({
						javaLogComplete
					})
			}
		});

		this.handleChange = this.handleChange.bind(this);
		this.runTest = this.runTest.bind(this);
		this.resetState = this.resetState.bind(this);
		this.fetchOneCaseParams = this.fetchOneCaseParams.bind(this);
	}

	componentDidMount() {
		this.fetchMongo()
	}

	handleChange(e, key) {
		this.setState({
			[key]: e.target.value
		});
	}

	runTest(e){
		e.preventDefault()

		fetch('/runTestCases',{
				method: 'POST',
				body: JSON.stringify({
						testType: this.state.testType,
						storefront: this.state.storefront,
						codeShare: this.state.codeShare,
						environment: this.state.environment,
						origin: this.state.origin,
						destination: this.state.destination
				}),
				headers: {"Content-Type": "application/json"}
				})
				.then( res => res.json()
						.then( res => {
								this.fetchMongo();
								this.setState({
										status: res.status,
										javaLog: "Finished"
								});
						})
				);

		this.setState({
				status: "in-progress",
				javaLog: "Starting Maven Project..."
		});
	}

	fetchMongo(){
		fetch('/getMongoData', {
				method: 'POST',
				headers: {"Content-Type": "application/json"}
			})
			.then( res => res.json() )
			.then( data => this.setState({
					dataTable: data.result
			}));
	}

	fetchOneCaseParams(e, name){
		fetch('/getOneCaseParams', {
				method: 'POST',
				body: JSON.stringify({
						name: name,
				}),
				headers: {"Content-Type": "application/json"}
			})
			.then( res => res.json() )
			.then( data => {
					this.setState({
						storefront: data.result.params.storefront,
						codeShare: data.result.params.codeShare,
						origin: data.result.params.origin,
						destination: data.result.params.destination,
						environment: data.result.params.environment
					})
			});
	}

	resetState(){
		this.setState(this.initialState)
		this.fetchMongo()
	}

	consolePanel(){
		this.setState({
			consolePanel: !this.state.consolePanel
		});
	}

	renderButton(){
		if ( this.state.status === "stopped"
				|| this.state.status === "finished" ) {
				return (
					<div>
						<button
								type="button"
								className="btn btn-primary"
								onClick={this.runTest}
						>
								Run
						</button> <span> </span>
						<button
								type="button"
								className="btn btn-primary"
								onClick={this.resetState}
						>
								Reset
						</button>
					</div>
				)
		} else if ( this.state.status === "in-progress") {
				return (
						<div>
									<BarLoader
											color={"#3699D7"}
											height={7}
											width={100}
											radius={4}
											loading={this.state.loading}
									/>
									<button
											type="button"
											className="btn btn-danger"
											onClick={(e) => this.consolePanel(e, this.state.javaLog)}
									>
											Stop
									</button>
						</div>
				)
		}
	}

	render() {
		console.log(this.state.dataTable);

		let dataTable = this.state.dataTable.map( (data, i) => {
			return <tr key={i}>
							<td>{data.name}</td>
							<td>{data.response.date}</td>
							<td>{data.params.environment}</td>
							<td>{data.params.origin}</td>
							<td>{data.params.destination}</td>
							<td>{data.params.storefront}</td>
							<td>{data.response.details}</td>
							<td><button
											type="button"
											className="btn btn-default"
											onClick={(e) => this.fetchOneCaseParams(e, data.name)}
									>
											Apply
									</button>
							</td>
							<td>
									<button
											type="button"
											className="btn btn-default"
									>
											+
									</button>
							</td>
						</tr>
		})

		return (
			<div className="panel panel-default">

				<div className="panel-heading">
						<img src="../img/aeromexico-logo.png" width="250" height="50" />
				</div>

				<RunTestBar
						consolePanel = { this.consolePanel }
				/>

				<table className="table table-striped table-sm">
					<thead>
						<tr>
							<th>Name</th>
							<th>Date</th>
							<th>Environment</th>
							<th>Origin</th>
							<th>Destination</th>
							<th>Storefront</th>
							<th>Details</th>
							<th>Parameters</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
							{ dataTable }
					</tbody>
				</table>

				<div className="panel-footer right">
						Powered by VIAJEZ
				</div>

			</div>
		);
	}

}
