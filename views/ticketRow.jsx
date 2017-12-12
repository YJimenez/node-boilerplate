import React, { Component } from 'react';
import fetch from 'isomorphic-fetch'
import CircularProgress from 'material-ui/CircularProgress';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export default class TicketRow extends Component {
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
			<div className="flex-grid-item">
				<Paper zDepth={2}>
					<h4><p>
						Ticket Id: &nbsp;
						<span className="lighter">
							{ ticket.id.substr( -7 ) }
						</span>
					</p></h4>
					<h4><p>
						Created at: &nbsp;
						<span className="lighter">
							{ new Date( ticket.createdAt ).toLocaleString() }
						</span>
					</p></h4>
					<h4><p>
						Updated at: &nbsp;
						<span className="lighter">
							{ updatedAt }
						</span>
					</p></h4>

					<Divider />

					<div className="button">
						{
							this.state.showLoader === true
							? this.showLoader()
							: ticketButton
						}
					</div>
				</Paper>
			</div>
		)
	}
}
