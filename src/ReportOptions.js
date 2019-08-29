import React from 'react';
import $ from './jquery-3.2.1';

export default class ReportOptions extends React.Component {
	state = {
		change: false,
		pid: this.props.pid
	}
	report = (num) => {
		let detail;
		if(num == 1){
			detail = 'Abusive Post';
		}else if(num == 2){
			detail = 'Offensive Post';
		}
		$.post("http://localhost:8080/newSwitch/Codelet/reportedPost.php",
		    {
		        id: localStorage.set_id,
		        pid: this.state.pid,
		        detail: detail,
		        suggest: ''
		    },
		   (data, status) => {
		   	console.log(data);
			   	if(data){
			   		let rep = JSON.parse(data);
			   		if(rep.state){
						this.setState({
							change: true,
						});
						this.props.report(this.state.pid);
					}else{
						this.setState({
							err: rep.error
						});
						setTimeout(()=>{
		    				this.setState({
		    					err: ''
		    				});
		    			},2000);
					}
			   	}
		    }
	    );
	}
	option = () => {
		this.props.option();
	}
	render() {
		if(!this.state.change){
			return (			
				<React.Fragment>
					<div className='row share-types' onClick={this.option}>
						<div className='col-1'>
						</div>
						<div className='col-10 text-left'>
							<span className=''>Move to another wall</span>
						</div>
					</div>
					<div className='row share-types' onClick={()=>this.report(1)}>
						<div className='col-1'>
						</div>
						<div className='col-10 text-left'>
							<span className=''>Abusive Post</span>
						</div>
					</div>
					<div className='row share-types' onClick={()=>this.report(2)}>
						<div className='col-1'>
						</div>
						<div className='col-10 text-left'>
							<span className=''>Offensive Post</span>
						</div>
					</div>
				</React.Fragment>
			);
		}else{
			return(
				<div className='suggest-wall'>
					<span className='report-sent'>Report Sent!</span>
				</div>
			)
		}
	}
}
