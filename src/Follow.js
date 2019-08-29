import React from 'react';

export default class Follow extends React.Component {
	loading = () => {
		this.props.loading();
	}

	render() {
		return (
			<React.Fragment>
			<h2>This is Follows</h2>
				<button type="button" onClick={this.loading} class="btn btn-primary" data-dismiss="modal">Close</button>
			</React.Fragment>
		);
	}
}
