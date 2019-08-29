import React,{Component, Fragment} from 'react';
import Interest from './Interest';
import Follow from './Follow';
import './Likes.css';

export default class Likes extends Component {
	state = {
		loading: false,
		phase: false
	}

    loading = () => {
		this.props.loading();
	}

	changeModal = () => {
		this.setState({
			loading: true
		});
		setTimeout(()=>{
			this.setState({
				phase: true,
				loading: false
			});
		},2000)
		
	}

	render() {
		let header,content='';
		if(this.state.loading){
			content = <span className="spinner-border spinner-border-lg spins"></span>;
		}else{
			if(!this.state.phase){
				content = <Interest changeModal={this.changeModal}/>;
				header = 'Select Interest';
			}else{
				content = <Follow loading={this.loading} />;
				header = 'People you might want to follow';
			}
		}
		return (
			<Fragment>
				<div className="modal-header text-center">
			        <span className="modal-title"><b className='interest'>{header}</b></span>
			        <button type="button" className="close" data-dismiss="modal">&times;</button>
		        </div>
		        <div className="modal-body md-body">
			        {content}
		        </div>
	        </Fragment>
		);
	}
}

