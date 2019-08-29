import React from 'react';
import $ from './jquery-3.2.1';
import UserDetails from './UserDetails';
import PostDesign from './PostDesign';
import FrequentUsers from './FrequentUsers';
import LocModal from './LocModal';


export default class Home_Content extends React.Component {
	state = {
		municipal: '',
		state: '',
		country: '',
		user: {},
		token: ''
	}
	componentDidMount() {
		this.getUserDetails();
	}
	getCookie = (cname) => {
		if(cname == ''){
			return false;
		}else{
		    let name = cname + "=";
		    let ca = document.cookie.split(';');
		    for(let i=0; i<ca.length; i++) {
		        let c = ca[i];
		        while (c.charAt(0)==' ') c = c.substring(1);
		        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		    }
		    return false;
		}
	}
	setCookie = (cname, cvalue, exdays) => {
	    let d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    let expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	    this.setState({
	    	token: cvalue
	    });
	}
	isJson = (item) => {
		item = typeof item !== 'string' ? JSON.stringify(item) : item ;
		try{
			item = JSON.parse(item);
		} catch (e) {
			return false
		}
		if((typeof item === 'object' || Array.isArray(item)) && item !== null){
			return item
		}
	}
	getUserDetails = () => {
		let access = this.getCookie('access');
		$.ajax({
            url: 'http://localhost:8080/newSwitch/Codelet/getUserDetails.php',
            type: "POST",
            headers: {"Authorization": `${access}`},
            beforeSend: () => {
            	
            },                    
            success: (data) => {	
	            console.log(data);			
				let user = this.isJson(data);
				if(user){
					if(access !== user.token){
						this.setCookie('access',user.token,8);
					}
					console.log(user);
					if(user.state){					
						this.setState({
							token: user.token,
							user: user.user,
							current: user.user.current,
							municipal: user.user.municipal,
							state: user.user.state,
							country: user.user.country
						});
					}
				}
            },
            error: (error) => {

            }
        })
	}
	following = (num,amt) => {
		let user = this.state.user;
		if(num === 1){
			user.following = user.following + amt;
		}
		else{
			user.following = user.following - amt;
		}
		this.setState({
			user 
		});
	}
	setLocation = (current, country, state, municipal) => {
		this.setState({
			current,
			country,
			state,
			municipal 
		});
		
	}

	render() {
		let location = {current: this.state.current, municipal: this.state.municipal, 
			state: this.state.state, country: this.state.country};
		return (
			<div className='container-fluid home_content'>
				<div className='row home_content'>
					<div className='col-xl-3 col-lg-x3 col-md-12 col-sm-12 text-center' style={{position: 'fixed',width: '25%', left: '1%', top: '5%'}}>
						<UserDetails user={this.state.user} location={location} following={this.following} token={this.state.token} 
						setCookie={this.setCookie}/>
					</div>
					<div className='col-xl-5 col-lg-5 col-md-12 col-sm-12 text-center' style={{marginLeft: '25%'}}>
						<PostDesign locate={location} user={this.state.user} following={this.following} token={this.state.token} 
						setCookie={this.setCookie}/>
					</div>
					<div className='col-3'>
						<FrequentUsers token={this.state.token} setCookie={this.setCookie}/>
					</div>
				</div>
				<LocModal setLocation={this.setLocation}/>
			</div>
		);
	}
}
