import React from 'react';
import { Route } from 'react-router-dom';

const NotFound = () => {
	return (
	<Route render={({ staticContext }) => {
		if (staticContext) {
			staticContext.status = 404;
		}
		return (
			<div>
				<h3>404 : Not Found</h3>
			</div>
		)
	}}/>
	);
};

export default NotFound;
