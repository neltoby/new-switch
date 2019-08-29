import React from 'react';
import $ from './jquery-3.2.1';

export default class Country extends React.Component {
	state= {
		countries: [],
		current: this.props.current
	}
	componentDidMount() {
		$.post('http://localhost:8080/newSwitch/Codelet/getCountry.php',
		    {
		        country: 1
		    },
		   (data, status) => {
				//check if data is array first
				let countries = JSON.parse(data)
				if(countries.length){
					this.setState({
						countries
					});
				}				
		    }
	    );
	}
	close = () => {
		this.props.close();
	}
	setLocation = (current,country,state,municipal) => {
		this.props.setLocation(current,country,state,municipal);
	}
	onChange = e => {
		this.setLocation(this.state.current, e.target.value, '', '');
		this.close();
	}

	render() {
		let countries = this.state.countries.map((country, i) => {
			return(
				<option value={country} key={i}>{country}</option>
				);
		})
		return (
			<React.Fragment>
				<div className='row'>
					<select name='country' className='custom-select' onChange={this.onChange}>
						<option selected disabled>Select Country</option>
						{countries}
					</select>
				</div>
				<br/>
				<br/>
			</React.Fragment>
		);
	}
}
