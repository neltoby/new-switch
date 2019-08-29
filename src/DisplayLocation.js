import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class DisplayLocation extends React.Component {
	state = {
		location: this.props.locate,
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.locate !== prevState.locate){
			return{
				locate: nextProps.locate,
			}
		}
		return null;
	}
	render() {
		let current = this.state.locate.current;
		let country = this.state.locate.country;
		let state = this.state.locate.state;
		let local = this.state.locate.municipal;
		if(current == 'country'){
			return (
				<React.Fragment>
					<FontAwesomeIcon icon='dot-circle' color='#fff' size='xs'/>
					&nbsp;&nbsp;<span className=''><b>{country}</b></span>
				</React.Fragment>
				);
		}else if(current == 'state'){
			return (
				<React.Fragment>
					<span className=''>{country}</span>&nbsp;&nbsp;
					<FontAwesomeIcon icon='dot-circle' color='#fff' size='xs'/>&nbsp;&nbsp;
					<span className=''><b>{state}</b></span>
				</React.Fragment>
			);
		}else{
			return (
				<React.Fragment>
					<span className=''>{country}</span>&nbsp;&nbsp;
							<FontAwesomeIcon icon='dot-circle' color='#fff' size='xs'/>&nbsp;&nbsp;
					<span className=''>{state}</span>&nbsp;&nbsp;
						<FontAwesomeIcon icon='dot-circle' color='#fff' size='xs'/>&nbsp;&nbsp;
					<span className=''><b>{local}</b></span>
				</React.Fragment>
			);
		}
		
	}
}
