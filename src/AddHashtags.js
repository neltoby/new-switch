import React from 'react';
import $ from './jquery-3.2.1';
import DeleteHash from './DeleteHash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class AddHashtags extends React.Component {
	state = {
		hashtag: '',
		interest: this.props.interest,
		hashtags: [],
		error: '',
		refused: [],
		existed: [],
		token: this.props.token
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.interest !== prevState.interest || nextProps.token !== prevState.token){
			return{
				interest: nextProps.interest,
				hashtag: '',
				token: nextProps.token
			}
		}
		return null;
	}
	componentDidUpdate(prevProps, prevState) {
		if(prevState.interest !== this.state.interest){
			this.getHashTags();
		}
	}
	componentDidMount() {
		this.getHashTags();
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
	addHashtags = () => {
		if(this.state.hashtag.trim().length){
			this.setState({
				refused: [] 
			});
			let hashtags = this.state.hashtag.slice();
			let splitHash = hashtags.split(/(\s+)/).filter((e) => {return e.trim().length > 0;});
			let refused = [];
			console.log(splitHash);
			let newhash = splitHash.filter((hash,i)=> {
				if(hash.charAt(0) === '#'){
					console.log(hash);
					return hash
				}else{
					refused.push(hash);
					console.log(hash);
				}
			})
			console.log(newhash);
			if(refused.length){
				this.setState({
					error: 'Every word should begin with #',
					refused
				});
				setTimeout(()=>{
					this.setState({
						error:'',
						refused: [] 
					});
				},5000);
			}else{			
				let interest = this.state.interest;
				// let hashtags = stat
				$.ajax({
		        	url: "http://localhost:8080/newSwitch/Codelet/addHashTags.php",
				    type: "POST",
				    headers: {"Authorization": `${this.state.token}`},
					data: {interest: interest, hashtags: newhash},
					beforeSend: () => {				
					},
					success: (data) => {
						if(data){
							console.log(data);
							let hashtag = this.isJson(data);
							if(hashtag){
								if(this.state.token !== hashtag.token){
									this.setCookie('access',hashtag.token,8);
								}							
								// document.cookie = "access="+hashtag.token+"; expires=Fri, 31 Dec 9999 23:59:59 UTC;";
								// console.log(hashtag);
								// console.log(hashtag.token);
								if(hashtag.state){
									let oldhash = this.state.hashtags.slice();
									// if(hashtag.existed){
									// 	sst
									// }
									this.setState({
										hashtag: '',
										hashtags: [...oldhash,...hashtag.hash],
										existed: hashtag.existed
									});
								}else{
									this.setState({
										error: hashtag.error
									});
									setTimeout(()=>{
										this.setState({
											error:'',
											refused: [] 
										});
									},5000)
								}
							}
						}
					},
					error: (err) => {
						console.log(err);
					}    			

		        });
			}
		}
	}
	getHashTags = () => {
		let interest = this.state.interest;
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getHashTags.php",
		    type: "POST",
		    headers: {"Authorization": `${this.state.token}`},
			data: {interest: interest},
			beforeSend: () => {
					this.setState({
						hashtags: []
					});			
			},
			success: (data) => {
				if(data){
					console.log(data);
					let hashtags = JSON.parse(data);
					if(this.state.token !== hashtags.token){
						this.setCookie('access',hashtags.token,8);
					}
					if(hashtags.state){						
						this.setState({
							hashtags: hashtags.hash,
						});
					}else{
						this.setState({
							error: hashtags.error 
						});
						setTimeout(()=>{
							this.setState({
								error:''
							});
						},5000);
					}
					
				}
			},
			error: (err) => {
				console.log(err);
			}    			

        });
	}
	deleteHashTags = (hash) => {
		let newhash = this.state.hashtags.slice();
		let sethash = newhash.filter((e) => {
			return e !== hash
		});
		this.setState({
			hashtags: sethash,
		});
	}
	onChange = (e) => {
		this.setState({
			hashtag: e.target.value
		});
	}

	render() {
		let placeholder = `#${this.state.interest} #Hashtag`;
		let refused =this.state.refused.map((elem,i) => {
			return <span className='refused'>{elem}</span>
		});
		let exist = this.state.existed.map((el,i) => {
			return <span className='existed'>{el}</span>
		})
		let existText = this.state.existed.length > 1 ? `Already have these hashtags for ${this.state.interest} wall - `: 
		`Already have this hashtag for ${this.state.interest} wall - `;
		let existed = this.state.existed.length ? <div className='hashtag-existed'> {existText}{exist}</div> : '' ;
		let error = this.state.error ? this.state.refused.length ? <div className='hashtag-error'> {refused} {this.state.error}</div>: 
		<div className='hashtag-error'>{this.state.error}</div>: '';
		let hashtag = this.state.hashtags.length ? this.state.hashtags.map((hash,i)=>{
			return(
				<DeleteHash hash={hash} deleteHashTags={this.deleteHashTags} key={i} interest={this.state.interest}
				token={this.state.token} setCookie={this.setCookie}/>
				)
		}): <div className='row hash-div-empty'>Your have not added {this.state.interest} wall hashtags.<br/>
		<span>By adding hashtags, you can follow all post on {this.state.interest} wall with these hashtag from any location you are on</span></div> ;
		return (
			<div className='row hashtag-header-row add-hash-row'>
				<div className='div-add-hashtag'>
					Add hashtags for {this.state.interest}
				</div>
				<div className="input-group mb-3 hashtag-grp">
				    <input type='text' className='form-control input-hashtag' placeholder={placeholder} value={this.state.hashtag} onChange={this.onChange} />
				    <div className="input-group-append input-hash">
					    <button type='button' className="input-group-text" onClick={this.addHashtags}>
						    <FontAwesomeIcon icon='arrow-right' color='#45505f' size='lg' />
					    </button> 
					</div>
			    </div>
			    {existed}
				{error}
				<div className='hashtag-content'>
					{hashtag}
				</div>
			</div>
		);
	}
}
