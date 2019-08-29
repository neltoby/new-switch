import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Span from './Span';
import Span_List from './Span_List';
import './Interest.css';

export default class Interest extends React.Component {
	state = {
		search: '',
		userLikes: [],
		add: [],
		select:['Politics','Business','Entertainment','Sport','Fashion','Beauty','Gossips','Jobs','Technology','Buy n Sell'],
		chosen: [],
		check: ['Apple','Mango','ReactJs','App','Django']
	}
	componentDidMount() {
		let id = localStorage.set_id;
		this.getInterest(id);
	}
	getInterest = (id) => {
		$.post('http://localhost:8080/newSwitch/Codelet/returnUserLikes.php',
		    {
		        id:id
		    },
		   (data, status) => {
				//check if data is array first
				if(data){
					console.log(data);
					let userLikes = JSON.parse(data);
					if(userLikes.state){
						this.setState({
							userLikes: userLikes.likes
						})	
					}
				}
		    }
	    );
	}
	checkSpanList = (i) => {
		let new_userLikes = this.state.userLikes.slice();
		let id = localStorage.set_id;
		let name = new_userLikes[i];
		$.post('http://localhost:8080/newSwitch/Codelet/deleteLikes.php',
		    {
		        id:id, name:name
		    },
		   (data, status) => {
		   	console.log(data);
				//check if data is array first
				if(data){
					let userLikes = JSON.parse(data);
					if(userLikes.state){
						new_userLikes.splice(i,1);
						this.setState({
							userLikes: new_userLikes 
						});
					}
				}				
		    }
	    );
		
	}
	add = () => {
		if(this.state.search.trim().length){
			let add_array =this.state.add.concat(this.state.search);
			let chosen_array = this.state.chosen.concat(this.state.search);
			document.getElementById('list').style.display = 'none';
			this.setState({
				add: add_array,
				search: '',
				chosen: chosen_array
			});
		}
	}
	changeModal = () => {
		if(this.state.chosen.length){
			let likes = this.state.chosen;
			let id = localStorage.set_id;
			$.ajax({
	            url: 'http://localhost:8080/newSwitch/Codelet/userLikes.php',
	            type: "POST",
	            data: {id: id, likes: likes},
	            beforeSend: () => {
	            	
	            },                    
	            success: (data) => {
					if(this.props.changeModal){
						this.props.changeModal();
					}else if(this.props.closeModal){
						// let id = localStorage.set_id;
						this.getInterest(id);
						// if(this.state.chosen.length){
						// 	let userLikes = this.state.userLikes.concat(this.state.chosen);
						// 	this.setState({
						// 		userLikes
						// 	});
						// }
						// setTimeout(()=>{
						// 	this.props.closeModal();
						// },2000);
												
					}
					this.setState({
						add: [],
						chosen:[]
					});
					
	            },
	            error: (error) => {

	            }
	        })
		}
		
	}
	getAlreadyInterest = (text) => {
		$.ajax({
	            url: 'http://localhost:8080/newSwitch/Codelet/getAlreadyInterest.php',
	            type: "POST",
	            data: {text: text},
	            beforeSend: () => {
	            	
	            },                    
	            success: (data) => {
					let check = JSON.parse(data);
					if(check.state){
						this.setState({
							check:check.likes 
						});
						document.getElementById('list').style.display = 'block';
					}											
	            },
	            error: (error) => {

	            }
        })
	}
	onChange = (e) => {
		this.setState({
			search: e.target.value
		});
		if(e.target.value.trim().length){
			this.getAlreadyInterest(e.target.value);
		}else{
			document.getElementById('list').style.display = 'none';
		}
	}
	colorChange = (i) => {
		let selected = this.state.select[i];
		let chosen = this.state.chosen.concat(selected)
		this.setState({
			chosen 
		});
		console.log(chosen);
	}
	pasteText = (search) => {
		this.setState({
			search 
		});
		if(this.state.search.trim().length){
			document.getElementById('list').style.display = 'none';
		}
	}
	colorOut = (i) => {
		let selected = this.state.select[i];
		let chosen = this.state.chosen.slice();
		chosen.forEach((ary,id) => {
			if(ary == selected){
				chosen.splice(id,1);
			}
		});
		console.log(chosen);
		this.setState({
			chosen 
		});
	}

	onClick = (i) => {
		let add_new = this.state.add.slice();
		let element = add_new[i];
		// alert(element);
		let new_chosen = this.state.chosen.slice();
		new_chosen.forEach((ary,i) => {
			if(ary == element){
				new_chosen.splice(i,1);
			}
		});
		console.log(new_chosen);

		add_new.splice(i, 1);
		this.setState({
			add: add_new,
			chosen: new_chosen
		});		 
	}

	render() {
		let liked = this.state.userLikes.length ? <span className='liked'>Already Liked</span> : '';
		let userlikes = this.state.userLikes.map((likes,i) => {
			return(
				<Span_List list={likes} key={i} checkSpanList={()=>{this.checkSpanList(i)}}/>
			);
		})
		let list_array = this.state.add.map((list, i) => {
			return(
				<Span item={list} check={list} key={i} onClick={()=>{this.onClick(i)}}/>
				);
		}) ;
		let sel_array = this.state.select.map((lists,i) => {
				        	return (<Span item={lists} key={i} colorChange={()=>{this.colorChange(i)}} colorOut={()=>{this.colorOut(i)}}/>);
				        });
		let list = this.state.check.map((lis, i) => {
			return(
				<li className='' key={i} onClick={()=>this.pasteText(lis)}>{lis}</li>
				);
		})
		let style = {
			fontSize: '1.5rem'
		}
		return (
			<React.Fragment>
				<div className='row already-liked'>
					{liked} &nbsp;&nbsp;{userlikes}
				</div>
				<div className='row add-interest'>
			        <div className='col-sm-2'>
			        </div>
			        <div className='col-sm-8'>
				        <ul className='first-list'>
					        <li className='first-item'>
						        <div className="input-group mb-3">
							        <input type='text' name='search' style={style} className='form-control' value={this.state.search} placeholder='Add Other Interest' onChange={this.onChange}/>
							        <div className="input-group-append">
									    <span className="input-group-text" onClick={this.add}><FontAwesomeIcon icon='plus' color='gray' /></span> 
									</div>
								</div>
								<ul className='list' id='list'>
									{list}
								</ul>
							</li>
						</ul>
			        </div>
		        </div>
		        <div className='row added-interest'>
				        {list_array}
		        </div>
		        <div className='row list-interest'>
			        {sel_array}
		        </div>
		        <div className='row send-interest'>
			        <div className='col-3'>
			        </div>
			        <div className='col-6'>
				        <button className='btn btn-primary form-control interest-option' onClick={this.changeModal}>Save</button>
			        </div>
			        <div className='col-3'>
			        </div>
		        </div>
			</React.Fragment>
		);
	}
}
