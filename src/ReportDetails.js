import React from 'react';
import $ from './jquery-3.2.1';

export default class ReportDetails extends React.Component {
	state= {
		report: '',
		err: '',
		pid: this.props.pid,
		change: false
	}
	closeshow = () => {
		this.props.closeshow();
	}
    onChange = (e) => {
    	this.setState({
    		report: e.target.value
    	});
    }
    onClick = () => {
    	if(this.state.report.trim().length > 1){
    		if(this.state.report.charAt(0) != '#'){
    			$.post("http://localhost:8080/newSwitch/Codelet/reportedPost.php",
				    {
				        id: localStorage.set_id,
				        pid: this.state.pid,
				        detail: 'Misplaced Wall',
				        suggest: this.state.report
				    },
				   (data, status) => {
				   	console.log(data);
					   	if(data){
					   		let rep = JSON.parse(data);
					   		if(rep.state){
								this.setState({
									change: true,
									report: '' 
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
    		}else{
    			this.setState({
    				err: '# should not be used for walls'
    			});
    			setTimeout(()=>{
    				this.setState({
    					err: ''
    				});
    			},2000);
    		}
    		
    	}else{
			this.setState({
				err: 'Suggestion must be 2 characters least'
			});
			setTimeout(()=>{
				this.setState({
					err: ''
				});
			},2000);
    	}
    }

	render() {
		if(!this.state.change){
			return (
				<React.Fragment>
					<div className='suggest-wall'>
						<input type='text' name='report' value={this.state.report} placeholder='Suggest preferred wall for this post' 
						onChange={this.onChange} className='form-control input-suggest' maxLength='100' 
						title='Suggestion must be a maximum of 100 characters'/>
					</div>
					<div className='suggest-button'>
						<div className='suggest-err'>{this.state.err}</div>
						<button type='button' onClick={this.onClick} className='btn btn-primary'>
							<b>Report</b>
						</button>
					</div>
				</React.Fragment>
			);
		}else{
			return(
				<div className='suggest-wall'>
					<span className='report-sent'>Report Sent!</span>
				</div>
			);
		}
	}
}
