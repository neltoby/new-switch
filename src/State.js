import React from 'react';
import $ from './jquery-3.2.1';

export default class State extends React.Component {
	state= {
		current: this.props.current,
		section: 'country',
		countries: [],
		states: [],
		country: '',
		state: ''
	}
	componentDidMount() {
		this.getCountry();
	}
	getCountry = () => {
		$.post('http://localhost:8080/newSwitch/Codelet/getCountry.php',
		    {
		        country: 1
		    },
		   (data, status) => {
				//check if data is array first
				if(data){
					let countries = JSON.parse(data)
					if(countries.length){
						this.setState({
							countries
						});
					}
				}				
		    }
	    );
	}
	getState = (country) => {
		if(country){
			$.post('http://localhost:8080/newSwitch/Codelet/selectCountry.php',
			    {
			        country: country
			    },
			   (data, status) => {
					//check if data is array first
					if(data){
						let states = JSON.parse(data)
						if(states.length){
							this.setState({
								states
							});
						}
					}				
			    }
		    );
		}
	}
	setLocation = (current,country,state,municipal) => {
		this.props.setLocation(current,country,state,municipal);
	}
	close = () => {
		this.props.close();
	}
	onChange = e => {
		if(e.target.name == 'country'){
			this.setState({
				states: [],
				country: e.target.value,
				state: '',
				section: 'state'
			});
			this.getState(e.target.value);
		}else{
			this.setState({
				state: e.target.value,
				section: 'country'
			});
			this.setLocation(this.state.current,this.state.country,e.target.value, '');
			this.close();
		}
	}

	render() {
		let listCountry = this.state.countries.map((country, i) => {
			return (
				<option value={country} key={i}>{country}</option>
				);
		})
		let listState = this.state.states.map((state, i) => {
			return (
				<option value={state} key={i}>{state}</option>
				);
		})
		if(this.state.section == 'country'){
			return (
				<React.Fragment>
					<div className='row'>
						<select name='country' className='custom-select' onChange={this.onChange} value={this.state.country}>
							<option value='' selected disabled>Select Country</option>
							{listCountry}
						</select>
					</div>
					<br/>
					<br/>
				</React.Fragment>
				);
		}
		return (
			<React.Fragment>
				<div className='row'>
					<select name='country' className='custom-select' onChange={this.onChange} value={this.state.country}>
						<option value='' selected disabled>Select Country</option>
						{listCountry}
					</select>
				</div>
				<br/>
				<br/>
				<div className='row'>
					<select name='state' className='custom-select' onChange={this.onChange} value={this.state.state}>
						<option value='' selected disabled>Select State</option>
						{listState}
					</select>
				</div>
				<br/>
				<br/>
			</React.Fragment>
		);
	}
}