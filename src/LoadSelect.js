import React from 'react';
import Country from './Country';
import State from './State';
import Municipal from './Municipal';

export default class LoadSelect extends React.Component {
	state= {
		current: '',
	}
	onClick = (e) => {
		this.setState({
			current: e.target.name
		});
	}
	setLocation = (current,country,state,municipal) => {
		this.props.setLocation(current,country,state,municipal);
	}
	close = () => {
		this.props.close();
	}

	render() {
		let location = '';
		if(this.state.current == 'country'){
			location = <Country current={this.state.current} setLocation={this.setLocation} close={this.close}/>;
		}else if(this.state.current == 'state'){
			location = <State current={this.state.current} setLocation={this.setLocation} close={this.close}/>;
		}
		else if(this.state.current == 'local'){
			location = <Municipal current={this.state.current} setLocation={this.setLocation} close={this.close}/>;
		}
		return (
			<div className='container-fluid div-change'>
				<div className=''>
					<div className='row text-center' style={{textAlign: 'center !important', fontWeight: '700', fontSize: '22px'}}>
						Change 
					</div>
					<br/>
					<div className='row'>
						<div className='col-4'>
							<button type='button' name='country' className='form-control btn btn-primary' onClick={this.onClick}>
								Country
							</button>
						</div>
						<div className='col-4'>
							<button type='button' name='state' className='form-control btn btn-primary' onClick={this.onClick}>
								State
							</button>
						</div>
					    <div className='col-4'>
							<button type='button' name='local' className='form-control btn btn-primary' onClick={this.onClick}>
								Town
							</button>
						</div>
					</div>
					<br/>
					<br/>
					{location}
				</div>	
			</div>
		);
	}
}
