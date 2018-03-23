import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import { subscribeToTimer } from './socketio';

export default class RunTestBar extends Component {

	constructor(props) {
		super(props);

		this.initialState = {
			value: "",
			testType: "OnewayNavigationTest",
			storefront: "es-mx",
			codeShare: "false",
			origin:"AGU",
			destination:"CUN",
			environment:"RC",
			status: "stopped",
			consolePanel: this.props.consolePanel,
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
		console.log('props' + this.props.consolePanel);

		return (
			<div className="panel-body">
				<div className="col-xs-12">
					<div className="panel panel-default">

						<table className="table table-bordered">
							<thead>
								<tr>
									<th>Test Type</th>
									<th>Storefront</th>
									<th>Codeshare</th>
									<th>Environment</th>
									<th>Origin</th>
									<th>Destination</th>
									<th className="col-sm-3"></th>
									<th className="col-sm-9" colSpan="2">Log</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<select value={this.state.testType}
												onChange={(e) => this.handleChange(e, 'testType')}>

												<option value="OnewayNavigationTest">Oneway</option>
												<option value="RoundtripNavigationTest">Roundtrip</option>
												<option value="TwoPassengersNavigationTest">Two Passengers</option>
										</select>
									</td>
									<td>
										<select value={this.state.storefront}
												onChange={(e) => this.handleChange(e, 'storefront')}>

												<option value="es-mx"> es-mx </option>
												<option value="es-us"> es-us </option>
												<option value="en-us"> en-us </option>
												<option value="en-ca"> en-ca </option>
												<option value="fr-ca"> fr-ca </option>
												<option value="en-eu"> en-eu </option>
												<option value="es-es"> es-es </option>
												<option value="en-gb"> en-gb </option>
												<option value="fr-fr"> fr-fr </option>
												<option value="en-nl"> en-nl </option>
												<option value="es-cl"> es-cl </option>
												<option value="es-cr"> es-cr </option>
												<option value="es-ec"> es-ec </option>
												<option value="es-sv"> es-sv </option>
												<option value="es-gt"> es-gt </option>
												<option value="es-hn"> es-hn </option>
												<option value="es-ni"> es-ni </option>
												<option value="es-pa"> es-pa </option>
												<option value="es-pe"> es-pe </option>
												<option value="es-do"> es-do </option>
										</select>
									</td>
									<td>
										<select value={this.state.codeShare}
												onChange={(e) => this.handleChange(e, 'codeShare')}>

												<option value="true">true</option>
												<option value="false">false</option>
										</select>
									</td>
									<td>
										<select value={this.state.environment}
												onChange={(e) => this.handleChange(e, 'environment')}
										>
												<option value="RC">RC</option>
												<option value="QA">QA</option>
												<option value="UAT">UAT</option>
												<option value="INT">INT</option>
										</select>
									</td>
									<td>
										<select value={this.state.origin}
												onChange={(e) => this.handleChange(e, 'origin')}
										>
												<option value="MEX">MEX</option>
												<option value="AGU">AGU</option>
												<option value="CDG">CDG</option>
												<option value="CUN">CUN</option>
										</select>
									</td>
									<td>
										<select value={this.state.destination}
												onChange={(e) => this.handleChange(e, 'destination')}
										>
												<option value="MEX">MEX</option>
												<option value="AGU">AGU</option>
												<option value="CDG">CDG</option>
												<option value="CUN">CUN</option>
										</select>
									</td>
									<td>
										{ this.renderButton() }
									</td>
									<td className="col-sm-11">
										{this.state.javaLog}
									</td>
									<td className="col-sm-1">
											<button
													type="button"
													className="btn btn-default"
													onClick={this.props.consolePanel}
											>
													+
											</button>
									</td>
								</tr>
							</tbody>
						</table>

						<div className={"panel-body consolePanelCollapse" + (this.state.consolePanel ? ' in' : '')}>
								{this.state.javaLogComplete}
						</div>

					</div>
				</div>
			</div>
		);
	}

}
