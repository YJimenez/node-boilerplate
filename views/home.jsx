import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton'

export default class Home extends Component {
	handleClick(e){
		alert('click works');
		console.log(e);
	}

	render() {

		return (
			<div>
				<h1>Home</h1>
				<h1>{this.props.test}</h1>
				<RaisedButton
					label="Material UI - Click"
					onClick={this.handleClick}
				/>
			</div>
		);
	}
}
