import React, { Component } from 'react';
import fetch from 'isomorphic-fetch'

import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';

export default class PassPageTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tickets: [],
			amount: '',
			showCheckboxes: false,
		};
	}

	componentWillMount() {
		//this.props.actions.getPassTicketStatus(this.props.match.params.id)
		fetch('https://api.graph.cool/simple/v1/civvmhoe91b0q01915qu3osfv', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTE1Mzc3ODQsImNsaWVudElkIjoiY2phY3lqMmJrMm1rYTAxMjFpdW91bzVmYSIsInByb2plY3RJZCI6ImNpdnZtaG9lOTFiMHEwMTkxNXF1M29zZnYiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqYWUya2oxeDFpYjMwMTQwOXc4M2ZyYWsifQ.-jgG-wkUyFNlcYCajrsv_ZtwNWmNR-gHpMVZt-RSBWg'
			},
			body: JSON.stringify({
				query : '{allPasses(filter:{id:\"'+ this.props.match.params.id +'\"})' +
				'{tickets{id used createdAt updatedAt}' +
				'cash (orderBy: createdAt_DESC first:1){balanceAmnt}}}',
			})
		})
			.then( res => res.json()
				.then( res => {
					this.setState({
						tickets: res.data.allPasses[0].tickets,
						amount: res.data.allPasses[0].cash[0].balanceAmnt,
						showLoader: false
					});
				})
			)
			.catch(res => {
				this.setState({
					tickets: 'not-found',
					showLoader: false
				});
			})
	}

	showLoader () {
		return (
			<div className="loader">
				<LinearProgress mode="determinate" />
			</div>
		)
	}

	renderTicket(){
		if( this.state.tickets.length > 0
			&& this.state.tickets !== 'not-found' ) {

			const ticketMap = this.state.tickets.map(( ticket ) => {
				console.log(ticket);
				return	<TicketRowTable
							key = { ticket.id }
							ticketId = { ticket.id }
							createdAt = { ticket.createdAt }
							updatedAt = { ticket.updatedAt }
							used = { ticket.used }
						/>
			});

			return (
				<Table
					height={this.state.height}
					fixedHeader={this.state.fixedHeader}
					fixedFooter={this.state.fixedFooter}
					selectable={this.state.selectable}
					multiSelectable={this.state.multiSelectable}
				>
				<TableHeader
					displaySelectAll={this.state.showCheckboxes}
					adjustForCheckbox={this.state.showCheckboxes}
					enableSelectAll={this.state.enableSelectAll}
				>
					<TableRow>
					  <TableHeaderColumn colSpan="4" tooltip="Görli Pass" style={{textAlign: 'center'}}>
						Görli Pass
					  </TableHeaderColumn>
					</TableRow>
					<TableRow>
						<TableHeaderColumn tooltip="Ticket Id">Ticket Id</TableHeaderColumn>
						<TableHeaderColumn tooltip="Created at">Created at</TableHeaderColumn>
						<TableHeaderColumn tooltip="Modified at">Modified at</TableHeaderColumn>
						<TableHeaderColumn tooltip="Status">Status</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody
					displayRowCheckbox={this.state.showCheckboxes}
					deselectOnClickaway={this.state.deselectOnClickaway}
					showRowHover={this.state.showRowHover}
					stripedRows={this.state.stripedRows}
				>

					{ ticketMap }

				</TableBody>
				</Table>
			)
		} else if ( this.state.tickets === 0 ) {
			return (
				<div>
					<h2> Pass ID: {this.props.match.params.id} </h2>
					<h2> This Pass not have tickets</h2>
				</div>
			)

		} else if ( this.state.tickets === 'not-found' ) {
			return (
				<div style={{padding: '20px'}}>
					<h3>This pass does not exist</h3><
				/div>
			)
		}
	}

	render () {
		let cash

		if( this.state.tickets !== 'not-found' ){
			cash = '$' + this.state.amount;
		}

		return (
			<Paper zDepth={2}>
				<div className="pass-title">
					<h4><p>
						Pass ID: &nbsp;
						<span className="lighter">
							{ this.props.match.params.id }
						</span>
					</p></h4>
					<h4><p>
						Nº tickets: &nbsp;
						<span className="lighter">
							{ this.state.tickets.length }
						</span>
					</p></h4>
					<h4><p>
						Balanced amount: &nbsp;
						<span className="lighter">
							<Link to="">{ cash }</Link>
						</span>
					</p></h4>
				</div>
				<Divider />
				<div>
					{
						this.state.showLoader === true
						? this.showLoader()
						: this.renderTicket()
					}
				</div>
		 	</Paper>
		)
	}
}

export class TicketRowTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.ticketId,
			createdAt: this.props.createdAt,
			updatedAt: this.props.updatedAt,
			used: this.props.used,
			showLoader: false
		};
	}

	changeTicketStatus( ticketId, value ) {
		this.setState( {
			showLoader: false
		} );
		//this.props.actions.postPassTicket(ticketId, value)
		fetch('https://api.graph.cool/simple/v1/civvmhoe91b0q01915qu3osfv', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTE1Mzc3ODQsImNsaWVudElkIjoiY2phY3lqMmJrMm1rYTAxMjFpdW91bzVmYSIsInByb2plY3RJZCI6ImNpdnZtaG9lOTFiMHEwMTkxNXF1M29zZnYiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqYWUya2oxeDFpYjMwMTQwOXc4M2ZyYWsifQ.-jgG-wkUyFNlcYCajrsv_ZtwNWmNR-gHpMVZt-RSBWg'
			},
			body: JSON.stringify({
				query : 'mutation{updateTicket( id:\"'+ ticketId +'\" used:\"'+value+'\") {id used updatedAt} }'
			})
		})
		.then( res => res.json()
			.then( res => {
				this.setState({
					updatedAt: res.data.updateTicket.updatedAt,
					used: res.data.updateTicket.used,
					showLoader: false
				});
			})
		)
		.catch( function( error ){
			console.log( error )
		});
	}

	showLoader () {
		return (
			<CircularProgress />
		)
	}

	render () {
		const ticket = this.state

		const updatedAt = ticket.createdAt === ticket.updatedAt
				? 'Not used yet'
				: new Date( ticket.updatedAt ).toLocaleString()

		const ticketButton = ticket.used === 'no'
				? <RaisedButton
					label="Disabled"
					onClick={this.changeTicketStatus.bind(this, ticket.id, 'yes')}
					disabled={false}
				/>
				: <RaisedButton
					label="Use Ticket"
					primary={true}
					onClick={this.changeTicketStatus.bind(this, ticket.id, 'no')}
				/>

		return (
			<TableRow>
				<TableRowColumn>{ ticket.id.substr( -7 ) }</TableRowColumn>
				<TableRowColumn>{ new Date( ticket.createdAt ).toLocaleString() }</TableRowColumn>
				<TableRowColumn>{ updatedAt }</TableRowColumn>
				<TableRowColumn>
					{
						this.state.showLoader === true
						? this.showLoader()
						: ticketButton
					}
				</TableRowColumn>
			</TableRow>
		)
	}
}
