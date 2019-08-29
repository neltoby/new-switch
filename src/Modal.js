import React,{Component, Fragment} from 'react';
import Likes from './Likes';

export default class Modal extends Component {
	loading = () => {
		this.props.loading();
	}

	render() {
		return (
			<Fragment>
				<button type="button" id='modal-btn' style={{display: 'none'}} data-toggle="modal" data-target="#rcModal">
				    Modal button
				</button>
				<div className="modal fade" id="rcModal">
					<div className="modal-dialog modal-lg">
					    <div className="modal-content">
					        <Likes loading={this.loading} />
					    </div>
				    </div>
			    </div>
		    </Fragment>
		);
	}
}
