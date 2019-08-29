import React from 'react';
import TurnOff from './TurnOff';

export default class TurnOffModal extends React.Component {
	state = {
		turnoff: this.props.turnoff,
		interest: this.props.interest,
		modal: this.props.modal,
		loading: this.props.loading
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.interest !== prevState.interest ||nextProps.modal !== prevState.modal || 
			nextProps.turnoff !== prevState.turnoff || nextProps.loading !== prevState.loading){
			return{
				interest: nextProps.interest,
				modal: nextProps.modal,
				turnoff: nextProps.turnoff,
				loading: nextProps.loading
			}
		}
		return null;
	}
	change = (id) => {
		this.props.change(id)		
	}
	
	close = () => {
		this.props.close();
	}

	render() {
		let title = this.state.turnoff.length ?`You turned these off from your ${this.state.interest} wall` : '';
		let head = this.state.turnoff.length ? 
			<div className='status-modal-header'>
				<div className='row row-modal-head'>
					<div className='col-10 status-modal-wall-title'>	
						<span className='status-modal-wall-turnoff-title'>
							{title}
						</span>				
					</div>
					<div className='col-2'>
						<span className='status-modal-close' onClick={this.close}>&times;</span>
					</div>
				</div>
			</div> : '' ;
		let close = !this.state.turnoff.length ?
		<div className='row'> 
			<div className='col-11'>
			</div>
			<div className='col-1'>	
				<span className='status-modal-close' onClick={this.close}>&times;</span>			
			</div>
		</div> : '' ;
		let num = this.state.loading ? <span className='spinner-border spinner-border-lg spins'></span> : this.state.turnoff.length ? 
		this.state.turnoff.map((turn,i) => {
			return(
				<TurnOff detail={turn} change={this.change} key={i} />
				)
		}) : <span className='no-turn-off'>You have no {this.state.interest} wall turn off</span> ;
		return (
			<div className='status-modal' style={{display: this.state.modal,overflow: 'auto'}}>
				<div className='status-modal-content'>
					{head}
					<div className='status-modal-body'>
						{close}
						{num}
					</div>
				</div>
			</div> 
		);
	}
}
