import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import { subscribeToTimer } from './socketio';

export default class Home extends Component {

	constructor(props) {
		super(props);

		this.initialState = {
			dataTable:[],
			value: "",
			title: "",
			option1: "",
			option2: ""
		};

		this.state = this.initialState;

		subscribeToTimer((err, javaLogComplete) => {
			let javaLog = "";

			if( javaLogComplete.indexOf("+-=") !== -1 ){

					javaLog = javaLogComplete.split('+-=').pop().split('=-+').shift();

					this.setState({
						javaLog,
						javaLogComplete: "( Java Console ) " + javaLog
					})
			} else {
					this.setState({
						javaLogComplete
					})
			}
		});

		this.handleChange = this.handleChange.bind(this);
		this.saveData = this.saveData.bind(this);
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

	saveData(e){
		e.preventDefault()

		fetch('/saveData',{
				method: 'POST',
				body: JSON.stringify({
						title: this.state.title,
						option1: this.state.option1,
						option2: this.state.option2
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

	createEndpoint(){
		fetch('/createEndpoint', {
				method: 'POST',
				headers: {"Content-Type": "application/json"}
			})
			.then( res => res.json() )
			.then( data => {
					window.open("./endpoint.json");
			});
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

	render() {
		console.log(this.state.dataTable);

		let dataTable = this.state.dataTable.map( (data, i) => {
			return <tr key={i}>
							<td>{data.title}</td>
							<td>{data.options.option1}</td>
							<td>{data.options.option2}</td>
						</tr>
		})

		return (
			<div className="panel panel-default">

				<div className="panel-heading">
						BOILERPLATE
				</div>

				<div className="panel-body">
				<div className="col-xs-12">
					<div className="panel panel-default">

						<table className="table table-bordered">
							<thead>
								<tr>
									<th>Titulo</th>
									<th>Opcion 1</th>
									<th>Opcion 2</th>
									<th className="col-sm-3"></th>
									<th className="col-sm-3"></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<label>
											<input type="text" name="title"
												value={this.state.title}
												onChange={(e) => this.handleChange(e, 'title')}
											/>
										</label>
									</td>
									<td>
										<label>
											<input type="text" name="option1"
												value={this.state.option1}
												onChange={(e) => this.handleChange(e, 'option1')}
											/>
										</label>
									</td>
									<td>
										<label>
											<input type="text" name="option2"
												value={this.state.option2}
												onChange={(e) => this.handleChange(e, 'option2')}
											/>
										</label>
									</td>
									<td>
										<button
												type="button"
												className="btn btn-primary"
												onClick={this.saveData}
										>
											Save data
										</button>
									</td>
									<td>
										<button
												type="button"
												className="btn btn-primary"
												onClick={this.createEndpoint}
										>
											Create Endpoint
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				</div>

				<table className="table table-striped table-sm">
									<thead>
										<tr>
											<th>Title</th>
											<th>Option 1</th>
											<th>Option 2</th>
										</tr>
									</thead>
									<tbody>
											{ dataTable }
									</tbody>
								</table>

				<div className="panel-footer right">
						Powered by LOS HOMMIES
				</div>
			</div>
		);
	}

}
