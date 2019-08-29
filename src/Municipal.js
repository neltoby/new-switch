import React from 'react';
import $ from './jquery-3.2.1';


export default class Municipal extends React.Component {
	state= {
		current: this.props.current,
		countries: [],
		states: [],
		municipals: [],
		country: '',
		state: '',
		municipal: '',
		section: 'country'
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
			   	if(data){
					//check if data is array first
					let countries = JSON.parse(data)
					if(countries.length){
						this.setState({
							countries
						});
					}else{
						this.setState({
							countries: []
						});
					}
				}				
		    }
	    );
	}
	getState = (country) => {
		$.post('http://localhost:8080/newSwitch/Codelet/selectCountry.php',
		    {
		        country: country
		    },
		   (data, status) => {
			   	if(data){
					//check if data is array first
					let states = JSON.parse(data)
					if(states.length){
						this.setState({
							states
						});
					}else{
						this.setState({
							states: [] 
						});
					}
				}				
		    }
	    );
	}
	getMunicipal = (country,state) => {
		$.post('http://localhost:8080/newSwitch/Codelet/selectState.php',
		    {
		        country: country,state: state
		    },
		   (data, status) => {
			   	if(data){
					//check if data is array first
					let municipals = JSON.parse(data)
					if(municipals.length){
						this.setState({
							municipals
						});
					}else{
						this.setState({
							municipals: [] 
						});
					}
				}				
		    }
	    );
	}
	onChange = e => {
		if(e.target.name == 'country'){
			this.setState({
				country: e.target.value,
				section: 'state',
				states: [],
				municipals: [],
				state: ''
			});
			this.getState(e.target.value);
		}else if(e.target.name == 'state'){
			this.setState({
				state: e.target.value,
				section: 'municipal',
				municipals: [],
				municipal: ''
			});
			this.getMunicipal(this.state.country, e.target.value);
		}else{
			this.setState({
				municipal: e.target.value,
				section: 'country'
			});
			this.setLocation(this.state.current,this.state.country,this.state.state,e.target.value);
			this.close();
		}
	}
	setLocation = (current,country,state,municipal) => {
		this.props.setLocation(current,country,state,municipal);
	}
	close = () => {
		this.props.close();
	}

	render() {
		let section = this.state.section;
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
		let listMunicipal = this.state.municipals.map((municipal, i) => {
			return (
				<option value={municipal} key={i}>{municipal}</option>
				);
		})
		if(section == 'country'){
			return (
				<React.Fragment>
					<div className='row'>
						<select name='country' className='custom-select' value={this.state.country || ''} onChange={this.onChange}>
							<option value='' selected disabled>Select Country</option>
							{listCountry}
						</select>
					</div>
					<br/>
					<br/>
				</React.Fragment>
				);
		}else if(section == 'state'){
			return (
					<React.Fragment>
						<div className='row'>
							<select name='country' className='custom-select' value={this.state.country || ''} onChange={this.onChange}>
								<option value='' selected disabled>Select Country</option>
								{listCountry}
							</select>
						</div>
						<br/>
						<br/>
						<div className='row'>
							<select name='state' className='custom-select' value={this.state.state  || ''} onChange={this.onChange}>
								<option value='' selected disabled>Select State</option>
								{listState}
							</select>
						</div>
						<br/>
						<br/>
					</React.Fragment>
				);
		}
		else if(section == 'municipal'){
			return (
				<React.Fragment>
					<div className='row'>
						<select name='country' className='custom-select' value={this.state.country} onChange={this.onChange}>
							<option value='' selected disabled>Select Country</option>
							{listCountry}
						</select>
					</div>
					<br/>
					<br/>
					<div className='row'>
						<select name='state' className='custom-select' value={this.state.state} onChange={this.onChange}>
							<option value='' selected disabled>Select State</option>
							{listState}
						</select>
					</div>
					<br/>
					<br/>
					<div className='row'>
						<select name='municipal' className='custom-select' value={this.state.municipal} onChange={this.onChange}>
							<option value='' selected disabled>Select Municipal</option>
							{listMunicipal}
						</select>
					</div>
					<br/>
					<br/>
				</React.Fragment>
			);
		}
		
	}
}