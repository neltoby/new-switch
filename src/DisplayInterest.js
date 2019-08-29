import React from 'react';
import WritePost from './WritePost';
import $ from './jquery-3.2.1';


export default class DisplayInterest extends React.Component {
	state = {
		location: this.props.locate,
		interest: this.props.interest,
		cut: this.props.cut,
		newpost: [],
		user: this.props.user,
		confirm: false,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.locate !== prevState.location  || nextProps.interest !== prevState.interest || 
			nextProps.cut !== prevState.cut || nextProps.user !== prevState.user || nextProps.token !== prevState.token){
			return{
				location: nextProps.locate,
				interest: nextProps.interest,
				cut: nextProps.cut,
				user: nextProps.user,
				token: nextProps.token
			}
		}
		return null;
	}
	componentDidUpdate(prevProps, prevState) {
		if(prevState.location !== this.state.location || prevState.interest !== this.state.interest){
			this.confirmInterest();
		}	
	}
	componentDidMount() {
		this.confirmInterest();
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
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
	confirmInterest = () => {
		let interest = this.state.interest;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/confirmInterest.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {interest: interest},
			beforeSend: () => {				
			},
			success: (data) => {
				if(data){
					console.log(data);
					let follow = this.isJson(data);
					if(follow){
						if(this.state.token !== follow.token){
							this.setCookie('access',follow.token,8);
						}
						if(follow.state){
							this.setState({
								confirm: true
							});
						}else{
							this.setState({
								confirm: false
							});
						}
					}
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        })
	}
	like = (num) => {
		if(num == 1){
			this.setState({
				confirm: true
			})
		}else{
			this.setState({
				confirm: false 
			});
		}
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}
	render() {
		return (
			<React.Fragment>
				<WritePost interest={this.state.interest} location={this.state.location} cut={this.state.cut} 
				user={this.state.user} following={this.following} confirm={this.state.confirm} 
				like={this.like} token={this.state.token} setCookie={this.setCookie}/>
			</React.Fragment>
		);
	}
}
