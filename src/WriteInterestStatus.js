import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import $ from './jquery-3.2.1';
import Status from './Status';
import WriteStatusModal from './WriteStatusModal';
import StatusStatic from './StatusStatic';
import './WriteInterestStatus.css';


export default class WriteInterestStatus extends React.Component {
	state = {
		user: this.props.user,
		interest: this.props.interest,
		location: this.props.location,
		status: '',
		sent: false,
		icons: false,
		error: '',
		placeholder: false,
		open: false,
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.interest !== prevState.interest ||
			nextProps.user !== prevState.user || nextProps.token !== prevState.token){
			return{
				location: nextProps.location,
				interest: nextProps.interest,
				user: nextProps.user,
				token: nextProps.token
			}
		}
		return null;
	}
	componentDidMount() {
		this.checkStatus();
	}
	onChange = (status) => {
		if(status.trim().length){
			this.setState({
				status,
				icons: true
			});
		}else{
			this.setState({
				status,
				icons: false
			});
		}
		
	}
	checkStatus = () => {
		let interest = this.state.interest;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/checkStatus.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {interest: interest},
			beforeSend: () => {
			},
			success: (response) => {
				console.log(response);
				if(response){
					let res = this.isJson(response);
					if(res){
						if(this.state.token !== res.token){
							this.setCookie('access',res.token,8);
						}
						if(res.state){
							this.setState({
								sent: true,
								status: res.status
							});
						}
					}
				}
			},
			error: () => {

			}    			
        });
	}
	edit = () => {
		this.setState({
			icons: true
		});
		this.openModal();
	}
	openModal = () => {
		this.setState({
			open: true
		});
	}
	closeModal = () => {
		this.setState({
			open: false
		});
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
	send = () => {
		if(this.state.icons){
			if(this.state.status.length > 14){
				let status = this.state.status;
				let interest = this.state.interest;
				$.ajax({
		        	url: "http://localhost:8080/newSwitch/Codelet/writeWallStatus.php",
				    type: "POST",
				    headers: {"Authorization": `${this.state.token}`},
					data: {status: status, interest: interest},
					beforeSend: () => {
					},
					success: (response) => {
						console.log(response);
						if(response){
							let res = this.isJson(response);
							if(res){
								if(this.state.token !== res.token){
									this.setCookie('access',res.token,8);
								}
								if(res.state){
									this.setState({
										sent: true,
										status: res.status
									});
									this.closeModal();
								}
							}
						}
					},
					error: () => {

					}    			
		        });
			}else{
				this.setState({
					error: '15 characters minimum' 
				});
				setTimeout(()=>{
					this.setState({
						error: '' 
					});
				},3000)
			}
		}
	}

	render() {
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.user.pic}`;
		let lastItem = '';
		if(this.state.location.current == 'local'){
			lastItem = this.state.location.municipal;
		}else if(this.state.location.current == 'state'){
			lastItem = this.state.location.state;
		}else{
			lastItem = this.state.location.country;
		}
		// onClick={()=>this.send()}
		let modal = this.state.open ? 'block' : 'none';
		// let textValue = this.state.status ? '20px': '40px';
		let shortPlaceholder = `Write ${this.state.interest} status`;
		let placeholder = `Write ${this.state.interest} status to subcribe for followers in ${lastItem}`;
		let send = this.state.icons ? ['far', 'paper-plane'] : 'feather-alt';
		let num = !this.state.status.length ? 0 : this.state.status.length;
		let display = this.state.sent ? <Status edit={this.edit} status={this.state.status} pic={this.state.user.pic} /> :
		<StatusStatic icons={this.state.icons} interest={this.state.interest} status={this.state.status} 
			openModal={this.openModal} pic={this.state.user.pic}/> ;
		let showPlaceholder = this.state.icons ? <div className='show-placeholder'>{placeholder}</div> : '';		
		return (
			<React.Fragment>
				{display}
				<WriteStatusModal status={this.state.status} location={this.state.location} interest={this.state.interest} 
				modal={modal} shortPlaceholder={shortPlaceholder} send={this.send} onChange={this.onChange} 
				error={this.state.error} close={this.closeModal} pic={this.state.user.pic} icons={this.state.icons}/>
			</React.Fragment>
		);
	}
}
