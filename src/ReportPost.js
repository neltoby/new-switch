import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReportOptions from './ReportOptions';
import ReportDetails from './ReportDetails';
import Reported from './Reported';

export default class ReportPost extends React.Component {
	state = {
		pid: this.props.pid,
		pix: this.props.pix,
		options: true,
		report: this.props.report
	}
	closeshow = () => {
		this.props.closeshow();
	}
	report = (id) => {
		this.props.reports(id);
	}
	option = () => {
		this.setState({
			options: false
		});
	}
	
	render() {
		let options;
		if(!this.state.report){
			options = this.state.options ? 
			<ReportOptions pid={this.state.pid} option={this.option} closeshow={this.closeshow} report={this.report}/> :
			<ReportDetails pid={this.state.pid} closeshow={this.closeshow} report={this.report}/> ;
		}else{
			options = <Reported />;
		}
		 
		
		let usrc = `http://localhost:8080/newSwitch/Profile/${this.state.pix}`;
		return (
			<div className='share-center'>
				<div className='row share-content'>
					<div className='row share-title share-div'>
						<div className='col-2'>
							<img src={usrc} width='35' height='35' alt='Image' className='rimg-share'/>
						</div>
						<div className='col-7'>
							Report Post
						</div>
						<div className='col-3'>
							<button className='close' onClick={this.closeshow}>&times;</button>
						</div>
					</div>
					{options}
				</div>
			</div>
		);
	}
}
