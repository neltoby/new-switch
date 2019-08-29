import React from 'react';
import Options from './Options';
import {Route} from 'react-router-dom';
import DisplayInterest from './DisplayInterest';


export default class PostDesign extends React.Component {
	state= {
		default_interest: 'Business',
		locate: this.props.locate,
		user: this.props.user,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.locate !== prevState.locate || nextProps.user !== prevState.user || nextProps.token !== prevState.token){
			return{
				locate: nextProps.locate,
				user: nextProps.user,
				token: nextProps.token
			}
		}
		return null;
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}
	open = () => {
		document.getElementById('locModal').style.display='block';
	}

	render() {
		// let loc = this.props.locate;
		// console.log(this.state.locate);
		return (
			<React.Fragment>
				<Options locate= {this.state.locate} token={this.state.token} setCookie={this.setCookie}/>
				<Route exact path="/home" render={({match}) => {
                		return(
                    		<DisplayInterest interest={this.state.default_interest} locate={this.state.locate} 
                    		following={this.following} user={this.state.user} token={this.state.token} setCookie={this.setCookie}/>
                		);
                }}/>
				<Route path="/home/:interest" render={({match}) => {
					let interest = '';
					let cut;
					if(match.params.interest.charAt(0) == '#'){
						interest = match.params.interest.slice(1);
						 cut = 1;
					}else{
						interest = match.params.interest;
						cut = 2;
					}
                		return(
                			<DisplayInterest interest={interest} locate={this.state.locate} cut={cut} 
                			following={this.following} user={this.state.user} token={this.state.token} setCookie={this.setCookie}/>
                		);
                }}/>
                
			</React.Fragment>
		);
	}
}
