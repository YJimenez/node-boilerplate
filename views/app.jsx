import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './home.jsx'
import PassPage from './passPage.jsx'
import NotFound from './notfound.jsx'

class App extends Component{

	render(){
		return (
			<div>
				<Switch>
					<Route
						exact path="/"
						render={ () =>
							<Home
								test="test"
							/>
						}
					/>
					<Route exact path="/gw/:id" component={PassPage}/>
					<Route component={NotFound}/>
				</Switch>
			</div>
		);
	}
}

export default App;
