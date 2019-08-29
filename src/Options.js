import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {NavLink} from 'react-router-dom';
import DisplayLocation from './DisplayLocation';
import './Options.css';

export default class Options extends React.Component {
	state = {
		select:['Politics','Business','Entertainment','Sport','Fashion','Beauty','Gossips','Jobs','Technology','Buy n Sell'],
		interest: [],
		locate: this.props.locate,
		token: this.props.token
	}
	componentDidMount() {
		this.getUserInterest(localStorage.set_id);
		// setInterval(() => {
		// 	this.getUserInterest(localStorage.set_id);
		// },1000);
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.locate !== prevState.locate || nextProps.token !== prevState.token){
			return{
				locate: nextProps.locate,
				token: nextProps.token
			}
		}
		return null;
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
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	getUserInterest = (id) => {
		$.ajax({
            url: 'http://localhost:8080/newSwitch/Codelet/getUserInterest.php',
            type: "POST",
            headers: {"Authorization": `${this.state.token}`},
            beforeSend: () => {
            	
            },                    
            success: (data) => {	
	            console.log(data);
	            if(data){		
					let interest = this.isJson(data);
					if(interest){
						if(this.state.token !== interest.token){
							this.setCookie('access',interest.token,8);
						}	
						// console.log(interest);
						if(interest.state){
							this.setState({
								interest: interest.interests
							});
						}else{
							this.setState({
								interest: []
							});
						}
					}
				}
            },
            error: (error) => {

            }
        })
	}
	open = () => {
		// document.getElementById('locModal').style.display='block';
		$('#locModal').fadeIn();
	}
	onHover = () => {
		$('#options').fadeIn();
	}
	onBlur = () => {
		setTimeout(()=>{
			$('#options').fadeOut(2000)
		},2000);
		
	}

	render() {
		// let current = this.state.locate.current;
		// let country = this.state.locate.country;
		// let state = this.state.locate.state;
		// let local = this.state.locate.municipal;
		let option = this.state.select.map((list,i) => {
			return(
				<li className='list-options' key={i}><NavLink to={`/home/${list}`} className='int-link'>{list}</NavLink></li>
				);
		})
		let opt = this.state.interest.map((list,i) => {
			let interest = list;
			if(interest.charAt(0) == '#'){
				interest = interest.slice(1);
			}
			return(
				<li className='list-options' key={i}><NavLink to={`/home/${interest}`} className='int-link'>{list}</NavLink></li>
			);
		})
		let optHead = this.state.interest.length ? <li className='li-head'>Your Interest</li> : '' ;
		return (
			<React.Fragment>
				<div className='row markers shadow'>
					<div className='col-9'>
					<div className='location-header'>Change a location</div>
						<span className='' onClick={this.open}><FontAwesomeIcon icon='map-marker-alt' color='tomato' size='2x'/></span>
						<br/>
						<DisplayLocation locate={this.state.locate}/>
					</div>
					<div className='col-3'>
					<div className='interest-header'>Select Interest</div>
						<span className='span-ellipsis' style={{margin: 'auto'}}>
							<span onClick={this.onHover}><FontAwesomeIcon icon='ellipsis-v' color='#ffffff' size='2x'/></span>
							<ul className='options' id='options' onMouseLeave={this.onBlur} onMouseOver={this.onHover}>
								<li className='list-options'>Interest</li>
								{option}
								{optHead}
								{opt}
							</ul>
						</span>
						
					</div>
				</div>
			</React.Fragment>
		);
	}
}
