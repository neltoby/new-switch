import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import $ from './jquery-3.2.1';
import './Home.css';
import Home_Content from './Home_Content';
import Modal from './Modal';

class Home extends Component {
	state = {
		change: false
	}
	componentDidMount() {
		
	}
	loading = () => {
		this.setState({
			change: true
		});
	}
	render(){
		const locationState = this.props.location.state;
		// const pathname = (
		// 	locationState && locationState.from && locationState.from.pathname
		// 	);
		// console.log(locationState);
		if(locationState){
			if(locationState.from === '/createaccount'){
				if(!this.state.change){
					$("#modal-btn").trigger('click');
					return(
						<Modal loading={this.loading}/>
						);
				}else{
					return(
						<Home_Content />
						);
				}
				
			}
		}
		return(
			<React.Fragment>
				<Home_Content />
			</React.Fragment>
		);
	};
}

export default Home;