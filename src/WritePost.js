import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './WritePost.css';
import WriteModal from './WriteModal';
import NewPost from './NewPost';
import './ThreadForm.css';
import People from './People';
import Interfaced from './Interfaced';
import Search from './Search';
import NoWritePost from './NoWritePost';
import SharedPost from './SharedPost';
import WriteInterestStatus from './WriteInterestStatus';
import $ from './jquery-3.2.1';
import soundFile from './audio_2.wav';

export default class WritePost extends React.Component {
	state = {
		post: '',
		tag: '',
		posts: [],
		people: [],
		search: '',
		search_cat: '',
		category: '',
		search_res: [],
		default: true,
		interest: this.props.interest,
		location: this.props.location,
		cut: this.props.cut,
		all_interest: '',
		all_followers: '',
		interest_followers: '',
		location_followers: '',
		interest_location: '',
		error: '',
		errorStatus: '',
		ff_array:[],
		empty_follower: false,
		user: this.props.user,
		confirm: this.props.confirm,
		turnoff: [],
		token: this.props.token
	}
	audio = new Audio(soundFile);
	// componentDidMount() {
		
	// }
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.interest !== prevState.interest || nextProps.token !== prevState.token ||
			nextProps.cut !== prevState.cut || nextProps.user !== prevState.user || nextProps.confirm !== prevState.confirm){
			let interest;
			if(nextProps.cut == 1){
				interest = `#${nextProps.interest}`;
			}else{
				interest = nextProps.interest;
			}

			return{
				location: nextProps.location,
				interest: interest,
				cut: nextProps.cut,
				ff_array: [],
				empty_follower: false,
				user: nextProps.user,
				confirm: nextProps.confirm,
				token: nextProps.token
			}
		}
		return null;
	}
	componentDidUpdate(prevProps, prevState) {
		if(prevState.location !== this.state.location || prevState.interest !== this.state.interest || 
			prevState.cut !== this.state.cut || prevState.confirm !== this.state.confirm){			
			console.log(prevState.location);
			console.log(this.state.location);			
			let interest = this.state.interest;
			let current = this.state.location.current;
			let country = this.state.location.country;
			let state = this.state.location.state;
			let local = this.state.location.municipal;
			let inter = {interest:interest};
			let info ;
			let loc ;
			if(current == 'country'){
				info = {interest: interest, current: current, country: country};
				loc = {current:current,country:country};
			}else if(current == 'state'){
				info = {interest: interest, current: current, country: country, state: state}
				loc = {current:current,country:country,state:state}; 
			}else if(current == 'local'){
				info = {interest: interest, current: current, country: country, state: state, local: local}; 
				loc = {current:current,country:country,state:state,local:local};
			}
			this.getPost(info);
			this.getAllFollowers(info);
			this.all_followers();
			this.interest_followers(inter);
			this.interest_location(info);
			this.location_followers(loc);
			this.getTurnOff();
		}
		
	}
	componentDidMount() {
		let intr;
		if(this.state.cut == 1){
			intr = `#${this.state.interest}`;
			this.setState({
				interest: intr
			});
		}
		let id = localStorage.set_id;
		let interest = this.state.interest;
		let current = this.state.location.current;
		let country = this.state.location.country;
		let state = this.state.location.state;
		let local = this.state.location.municipal;
		let inter = {interest:interest};
		let info;
		let datas;
		let loc;
		if(current == 'country'){
			info = {interest: interest,  current: current, country:country};
			datas = {interest:interest,current:current,country:country};
			loc = {current:current,country:country};
		}else if(current == 'state'){
			info = {interest: interest, current: current, country: country, state: state} 
			datas = {interest:interest,current:current,country:country,state:state};
			loc = {current:current,country:country,state:state};
		}else if(current == 'local'){
			info = {interest: interest, current: current, country: country, state: state, local: local}
			datas = {interest:interest,current:current,country:country,state:state,local:local};
			loc = {current:current,country:country,state:state,local:local}; 
		}
		this.getPost(info);	
		this.getAllFollowers(info);
		this.all_followers();
		this.interest_followers(inter);
		this.interest_location(datas);
		this.location_followers(loc);
		this.getTurnOff();
	}
	setCookie = (name,value,expire) => {
		this.props.setCookie(name,value,expire);
	}
	callGetPost = () => {
		let interest = this.state.interest;
		let current = this.state.location.current;
		let inter = {interest:interest};
		let info ;
		if(current == 'country'){
			info = {interest: interest, current: current, 
				country: this.state.location.country};
		}else if(current == 'state'){
			info = {interest: interest, current: current, 
				country: this.state.location.country, state: this.state.location.state} 
		}else if(current == 'local'){
			info = {interest: interest, current: current, 
				country: this.state.location.country, state: this.state.location.state, local: this.state.location.municipal} 
		}
		this.getPost(info,1);
		this.following(1,this.state.ff_array.length);
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
	likeInterestWall = (num) => {
		if(this.state.token){
			let interest = this.state.interest;
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/likeInterestWall.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: {interest: interest, num: num},
				beforeSend: () => {				
				},
				success: (data) => {
					if(data){				
						let follow = this.isJson(data);
						if(follow){
							if(this.state.token !== follow.token){
								this.setCookie('access',follow.token,8);
							}
							if(follow.state){
								this.props.like(num);
							}						
						}				
					}
				},
				error: (err) => {
					console.log(err);
				}    			
	        })
		}
	}
	getAllFollowers = (interest) => {
		if(this.state.token){
			this.setState({
				all_interest: '' 
			});
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/getAllFollowers.php",
			    type: "POST",
				data: interest,
				beforeSend: () => {
					this.setState({
						all_interest: '' 
					});
				},
				success: (response) => {
					console.log(response);
					if(response){
						let res = this.isJson(response);
						if(res){
							if(res.status){
								if(!res.count || res.count == 0 || res.count < 1 ){
									this.setState({
										all_interest: 'No followers' 
									});
								}else if(res.count > 0 && res.count < 2){
									let follow = `${res.count} follower`;
									this.setState({
										all_interest: follow
									});
								}else{
									this.setState({
										all_interest: `${res.count} followers` 
									});
								}						
							}							
							console.log(this.state.all_followers);
						}
					}
				
				},
				error: () => {

				}    			
	        });
		}
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}
	all_followers = () => {
		if(this.state.token){
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/allFollowers.php",
			    type: "POST",
				headers: {"Authorization": `${this.state.token}`},
				beforeSend: () => {
					console.log(this.state.token);
				},
				success: (response) => {
					console.log(response);
					if(response){
						let res = this.isJson(response);
						if(res){
							if(this.state.token !== res.token){
								this.setCookie('access',res.token,8);
							}
							if(res.status){
								if(res.count == 0){
									this.setState({
										all_followers: 'No followers' 
									});
								}else if(res.count > 0 && res.count < 2){
									let follow = `${res.count} follower`;
									this.setState({
										all_followers: follow
									});
								}else{
									this.setState({
										all_followers: `${res.count} followers` 
									});
								}						
							}							
							console.log(this.state.all_followers);
						}
					}
				
				},
				error: () => {

				}    			
	        });
		}
	}
	interest_followers = (info) => {
		if(this.state.token){
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/interestFollowers.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: info,
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
							if(res.status){
								if(res.count == 0){
									this.setState({
										interest_followers: 'No followers' 
									});
								}else if(res.count > 0 && res.count < 2){
									let follow = `${res.count} follower`;
									this.setState({
										interest_followers: follow
									});
								}else{
									this.setState({
										interest_followers: `${res.count} followers` 
									});
								}						
							}							
							console.log(this.state.interest_followers);
						}
					}
				
				},
				error: () => {

				}    			
	        });
		}
	}
	interest_location = (info) => {
		if(this.state.token){
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/interestLocation.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: info,
				beforeSend: () => {
					this.setState({
						interest_location: '' 
					});
				},
				success: (response) => {
					console.log(response);
					if(response){
						let res = this.isJson(response);
						if(res){
							if(this.state.token !== res.token){
								this.setCookie('access',res.token,8);
							}
							if(res.status){
								if(!res.count || res.count == 0 || res.count < 1 ){
									this.setState({
										interest_location: 'No followers' 
									});
								}else if(res.count > 0 && res.count < 2){
									let follow = `${res.count} follower`;
									this.setState({
										interest_location: follow
									});
								}else{
									this.setState({
										interest_location: `${res.count} followers` 
									});
								}						
							}							
							console.log(this.state.interest_location);
						}
					}
				
				},
				error: () => {

				}    			
	        });
		}
	}
	location_followers = (info) => {
		if(this.state.token){
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/locationFollowers.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: info,
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
							if(res.status){
								if(res.count == 0){
									this.setState({
										location_followers: 'No followers' 
									});
								}else if(res.count > 0 && res.count < 2){
									let follow = `${res.count} follower`;
									this.setState({
										location_followers: follow
									});
								}else{
									this.setState({
										location_followers: `${res.count} followers` 
									});
								}						
							}							
							console.log(this.state.location_followers);
						}
					}
				
				},
				error: () => {

				}    			
	        });
		}
	}
	getPost = (info,num=0) => {
		this.setState({
			posts: [],
			people: [],
			empty_follower: false
		});
		if(this.state.confirm){
			if(this.state.token){
				$.ajax({
		        	url: "http://localhost:8080/newSwitch/Codelet/getPost.php",
				    type: "POST",
				    headers: {"Authorization": `${this.state.token}`},
					data: info,
					beforeSend: () => {
						this.setState({
							posts: [],
							people: [],
							empty_follower: false
						});
					},
					success: (response) => {
						console.log(response);				
						if(response){
							let post = this.isJson(response);
							if(post){
								if(this.state.token !== post.token){
									this.setCookie('access',post.token,8);
								}		
								if(post.state){						
									this.setState({
										posts : post.all,
										category: post.category
									});
									console.log(this.state.posts);
								}else{
									if(num == 0){
										this.getFollowers(info);
									}else{
										this.setState({
											category: 'people',
											empty_follower: true,
											people: [],
											ff_array: []
										});
									}
								}
							}
						}
					},
					error: () => {

					}    			
		        });
			}
		}
	}
	getFollowers = (info) => {
		if(this.state.token){
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/getPeople.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: info,
				beforeSend: () => {
					this.setState({
						people: [],
						empty_follower: false
					});
				},
				success: (response) => {
					console.log(response);
					if(response){
						let pple = JSON.parse(response);
						if(this.state.token !== pple.token){
							this.setCookie('access',pple.token,8);
						}		
						if(pple.state && pple.all.length){						
							this.setState({
								people : pple.all,
								category: pple.category
							});
							console.log(this.state.people);
						}else{
							this.setState({
								empty_follower: true
							});
						}
					}
				},
				error: () => {

				}    			
	        });
		}
	}
	newPost = (post) => {
		let npost = this.state.posts.slice();
		let posts = [post,...npost];
		console.log(posts);
		this.setState({
			posts: []
		})
		this.setState({
			posts
		});
	}
	follow = (id,num) => {
		const follows = this.state.posts.map((post,i) => {
			if(post.uid === id){
				if(num == 0){
					return Object.assign({}, post, {
						follow: false
					})
				}else{
					return Object.assign({}, post, {
						follow: true
					})
				}
				
			}else{
				return post;
			}
		})

		this.setState({
			posts: follows 
		});
	}
	getTurnOff = () => {
		if(this.state.token){
			let interest = this.state.interest;
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/getTurnOff.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: {interest: interest},
				beforeSend: () => {
					this.setState({
						turnoff: []
					});
				},
				success: (response) => {
					console.log(response);
					if(response){
						let res = JSON.parse(response);		
						if(this.state.token !== res.token){
							this.setCookie('access',res.token,8);
						}	
						if(res.state){
							this.setState({
								turnoff: res.res ,
							});
						}
					}
				},
				error: () => {

				}    			
	        });
		}
	}
	report = (id) => {
		const reportPost = this.state.posts.map((post,i) => {
			if(post.pid === id){
				return Object.assign({}, post, {
					report: true
				})
			}else{
				console.log(post);
				return post
			}
		})
		this.setState({
			posts: reportPost
		});
	}
	editEpost = (id,epost) => {
		const nextPost = this.state.posts.map((post,i) => {
			if(post.pid === id){
				return Object.assign({}, post, {
					post: epost,
				})
			}else{
				return post;
			}
		})
		this.setState({
			posts: nextPost
		})
	}
	editEtag = (id,etag) => {
		const nextPos = this.state.posts.map((post,i) => {
			if(post.pid === id){
				return Object.assign({}, post, {
					tag: etag,
				})
			}else{
				return post;
			}
		})
		console.log(nextPos);
		this.setState({
			posts: nextPos
		})
	}
	sendEdit = (epost,etag,id) => {
		if(this.state.token){
			let info = {post: epost, tag: etag}
			$.ajax({
	        	url: "http://localhost:8080/newSwitch/Codelet/editPost.php",
			    type: "POST",
			    headers: {"Authorization": `${this.state.token}`},
				data: info,
				beforeSend: () => {
				},
				success: (response) => {
					console.log(response);
					if(response){
						let res = JSON.parse(response);
						if(this.state.token !== res.token){
							this.setCookie('access',res.token,8);
						}
						if(res.status){
							const nextPost = this.state.posts.map((post,i) => {
								if(post.pid === id){
									return Object.assign({}, post, {
										post: epost,
										tag: etag,
									})
								}else{
									return post;
								}
							})
							console.log(nextPost);
							this.setState({
								posts: nextPost
							});						
						}
						else{
							const nextPost = this.state.posts.map((post,i) => {
								if(post.pid === id){
									return Object.assign({}, post, {
										editerr: true,
										errText: res.error,
									})
								}else{
									return post;
								}
							})
							console.log(nextPost);
							this.setState({
								posts: nextPost
							});	
						}							
						// console.log(this.state.interest_followers);
					}
				
				},
				error: () => {

				}    			
	        });
		}
	}
	saved = (id) => {
		const nextPost = this.state.posts.map((post,i) => {
			if(post.pid === id){
				// console.log(id+' was called');
				return Object.assign({}, post, {
					saved: true
				})
			}else{
				return post;
			}
		})
		this.setState({
			posts: nextPost 
		});
	}
	likes = (id,status) => {
		// const audio
		const nextLike = this.state.posts.map((post,i) => {
			if(post.pid === id){
				// console.log(id+' was called');
				if(status == 1){
					this.audio.play();
					return Object.assign({}, post, {
						likes: post.likes + 1,
						like: true
					})
				}else{
					return Object.assign({}, post, {
						likes: post.likes - 1,
						like: false
					})
				}
			}else{
				return post;
			}
		})
		this.setState({
			posts: nextLike 
		});
		// console.log(nextLike);
	} 
	thread = (id) => {
		const nextPost = this.state.posts.map((post,i) =>{
			if(post.pid == id){
				return Object.assign({}, post, {
					thread: post.thread + 1
				})
			}else{
				return post;
			}
		})
		this.setState({
			posts: nextPost
		});
	}
	ppleFollow = (id,num) => {
		const pple = this.state.people.map((ple,i)=> {
			if(ple.uid  === id){
				if(num == 1){
					return Object.assign({}, ple, {
		           		follow: true
		           	})
				}else{
					return Object.assign({}, ple, {
		           		follow: false
		           	})
				}				
			}else{
				return ple;
			}
		})
		let ff_array = this.state.ff_array.slice();
		if(num == 1){
			ff_array.push(id);
			this.setState({
				ff_array
			});
			console.log(ff_array);
		}else{
			let f_array = ff_array.filter((arr,i)=>{
				if(arr != id)
					return arr;
			})
			this.setState({
				ff_array: f_array
			});
			console.log(f_array);
		}
		this.setState({
			people: pple
		});
	}
	updateComment = (id) => {
		const nextcomment = this.state.posts.map((post,i) => {
			if(post.pid  === id){
				return Object.assign({}, post, {
	           		comment: post.comment + 1,
	           	})
			}else{
				return post;
			}
		})
		this.setState({
			posts: nextcomment
		});
	}	
	writeModal = () => {
		document.getElementById('wrtModal').style.display = 'block';
	}
	search = (search_cat) => {
		if(this.state.search.trim().length > 3){
			this.setState({
				default: false,
				search_cat
			});
		}
	}
	onChange = (search) => {
		this.setState({
			search
		});
	}
	write = () => {
		this.setState({
			default: true,
			search: ''
		});
	}
	turnoff = (id) => {
		let nposts = this.state.posts.slice();
		let posts = nposts.map((post,i) => {
			if(post.uid !== id){
				return post;
			}else{
				if(post.type == 'nshare'){
					return post
				}else{					
					let turnoff = this.state.turnoff.slice();
					let newTurnoffObj = {uid: post.uid,fname: post.fname,uname :post.uname,upix: post.upix,turnoff: true}
					let newTurnoff = [newTurnoffObj,...turnoff];
					this.setState({
						turnoff: newTurnoff,
					});
					console.log(newTurnoff);
					return Object.assign({}, post, {
		           		turnoff: true
		           	})
				}
			}
		})
		this.setState({
			posts 
		});
	}
	turnoffchange = (id) => {
		let nposts = this.state.posts.slice();
		let nturnoff = this.state.turnoff.slice();
		let posts = nposts.map((post,i) => {
			if(post.uid == id){
				return Object.assign({}, post, {
	           		turnoff: false
	           	})
			}
		})
		let  turnoff = nturnoff.filter((pple,i) => {
			if(pple.uid !== id){
				return pple;
			}
		})
		this.setState({
			posts,turnoff				 
		});	
	}
	render() {
		let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
		let first = alphabet[Math.floor(Math.random() * alphabet.length)];
		let second = alphabet[Math.floor(Math.random() * (alphabet.length-1))];
		let third = alphabet[Math.floor(Math.random() * (alphabet.length-2))];
		let fouth = alphabet[Math.floor(Math.random() * (alphabet.length-3))];
		let id = `${first}${second}${localStorage.set_id}${third}${fouth}`;
		let lastItem = '';
		if(this.state.location.current == 'local'){
			lastItem = this.state.location.municipal;
		}else if(this.state.location.current == 'state'){
			lastItem = this.state.location.state;
		}else{
			lastItem = this.state.location.country;
		}
		let empty_follower = this.state.empty_follower ? 
		`There isn't other follower nor post of ${this.state.interest} wall in ${lastItem}` : '';
		let placeholder = `Talk ${this.state.interest} in ${lastItem}`;
		let searchholder = `Search ${lastItem} on ${this.state.interest}`;
		let heading;
		if(this.state.category == 'post' && this.state.posts.length){
			heading ='';
		} else if(this.state.category == 'people' && this.state.people.length){
			heading = `People You Could Follow in ${lastItem} On ${this.state.interest}`;
		}else if(!this.state.posts.length && this.state.people.length){
			heading = `People You Could Follow in ${lastItem} On ${this.state.interest}`;
		}else{
			heading = '';
		}
		let shortInterest = this.state.interest.length > 6 ? `${this.state.interest.substr(0,6)}...`: this.state.interest ;
		let newLastItem = lastItem.length > 10 ? `${lastItem.substr(0,10)}...` : lastItem ;
		let Inter_faced;
		let folowButton;
		if(this.state.confirm){
			folowButton = <div className='container-fluid form-div '><div className='row'><div className='col-8 interest-wall'>
					<b>{this.state.interest} wall <sup><span className='span-sup' title={lastItem}>{newLastItem}</span></sup>
					&nbsp;- &nbsp;{this.state.all_interest}</b></div>
					<div className='col-4'><button className='form-control following-wall' onClick={()=>this.likeInterestWall(0)}>
					FOLLOWING {shortInterest} Wall</button>
					</div></div></div>
			if(this.state.interest_location !== 'No followers'){
				Inter_faced = <React.Fragment><Interfaced interest={this.state.interest} all_interest={this.state.all_interest} 
					placeholder={placeholder} writeModal={this.writeModal} searchholder={searchholder} 
					searchvalue={this.state.search} onClick={this.search} onChange={this.onChange} user={this.state.user} 
					turnoff={this.state.turnoff} change={this.turnoffchange} token={this.state.token} setCookie={this.setCookie}/>
					<WriteInterestStatus interest={this.state.interest} user={this.state.user} 
					location={this.state.location} token={this.state.token} setCookie={this.setCookie}/></React.Fragment>
			}else{
				Inter_faced = <WriteInterestStatus interest={this.state.interest} user={this.state.user} 
				location={this.state.location} token={this.state.token} setCookie={this.setCookie}/>
				//share same interest but not your followers yet and could share same location or not
			}
		}else{
			folowButton = <div className='container-fluid form-div'><div className='row'><div className='col-8 interest-wall'>
					<b>{this.state.interest} wall <sup><span className='span-sup' title={lastItem}>{newLastItem}</span></sup> 
					&nbsp;&nbsp;- &nbsp;&nbsp;{this.state.all_interest}</b></div>
					<div className='col-4'><button className='form-control follow-wall' onClick={()=>this.likeInterestWall(1)}>
					FOLLOW {shortInterest} Wall</button></div>
					</div></div>
			let check_followers = this.state.interest_location !== 'No followers' ? true : false;
			Inter_faced = <NoWritePost interest={this.state.interest} followers={check_followers}
			location={this.state.location} token={this.state.token} setCookie={this.setCookie}/>
		}
		let tag = this.state.tag ? <input type='text' name='tag' placeholder='Tag Post' value={this.state.tagtext} 
				className='form-control thread-tag' onChange={this.onChange}/>: '' ;
		let tagErr = this.state.errorStatus == 'tag' ? this.state.error : '' ;
		let postErr = this.state.errorStatus == 'post' ? this.state.error : '' ;
		// ${this.state.interest} Post From Followers in ${lastItem}
		let post = this.state.confirm ? this.state.category == 'post' && this.state.posts.length ? this.state.posts.map((post,i) => {
			if(post.type == 'post'){
				let num = i;
				let ctotal = num == this.state.posts.length-1 ? false: true;				
				return(
					<NewPost post={post} key={i} updateComment={this.updateComment} newPost={this.newPost} thread={this.thread}
					likes={this.likes} interest={this.state.interest} location={this.state.location} all={this.state.all_followers}
					interestF={this.state.interest_followers} locationF={this.state.location_followers} editEpost={this.editEpost}
					intLocation={this.state.interest_location} follow={this.follow} sendEdit={this.sendEdit} editEtag={this.editEtag} 
					saved={this.saved} report={this.report} user={this.state.user} following={this.following} ctotal={ctotal} 
					turnoff={this.turnoff} token={this.state.token} setCookie={this.setCookie}/>
					);
			}else{
				let num = i;
				let ctotal = num == this.state.posts.length-1 ? false: true;
				return(
					<SharedPost post={post} key={i} ctotal={ctotal} user={this.state.user} follow={this.follow}
					likes={this.likes} interest={this.state.interest} location={this.state.location} all={this.state.all_followers}
					interestF={this.state.interest_followers} locationF={this.state.location_followers}
					intLocation={this.state.interest_location} following={this.following} turnoff={this.turnoff}
					saved={this.saved} token={this.state.token} setCookie={this.setCookie}/>
					)
			}
		}) : this.state.people.map((pple,i)=>{
			return(
				<People people={pple} key={i} interest={this.state.interest} ppleFollow={this.ppleFollow} 
				user={this.state.user} token={this.state.token} setCookie={this.setCookie}/>
				);
		}): '';
		let offPost = this.state.category != 'post' && this.state.posts.length ? this.state.posts.map((post,i) => {
			let num = i;
			let ctotal = num == this.state.posts.length-1 ? false: true;
				return(
					<NewPost post={post} key={i} updateComment={this.updateComment} newPost={this.newPost} thread={this.thread}
					likes={this.likes} interest={this.state.interest} location={this.state.location} all={this.state.all_followers}
					interestF={this.state.interest_followers} locationF={this.state.location_followers} editEpost={this.editEpost}
					intLocation={this.state.interest_location} follow={this.follow} sendEdit={this.sendEdit} editEtag={this.editEtag} 
					saved={this.saved} report={this.report} user={this.state.user} following={this.following} ctotal={ctotal}
					turnoff={this.turnoff} token={this.state.token} setCookie={this.setCookie}/>
					);
		}): '';
		let offPost_heading = this.state.category != 'post' && this.state.posts.length ? 
		<h4>Your recent post on {this.state.interest} wall in {lastItem}</h4>: '';
		let ff_write = this.state.ff_array.length ? <div className="write-span" onClick={this.callGetPost}>
			<span className='write-span'><FontAwesomeIcon icon='feather-alt' color='#fff' size='2x' className='span-write'/>
			</span></div> : '' ;
		if(this.state.default){
			return (
				<React.Fragment>
					{folowButton}
					{Inter_faced}
					{offPost_heading}
					{offPost}					
					{empty_follower}
					{post}
					{ff_write}	
					
					<WriteModal location={this.state.location} interest={this.state.interest} newPost={this.newPost}
					 all_interest={this.state.all_interest} user={this.state.user} token={this.state.token} setCookie={this.setCookie}/>

				</React.Fragment>
			);
		}else{
			return(
				<React.Fragment>
					<Search write={this.write} searchholder={searchholder} onChange={this.onChange} search={this.state.search}
					location={this.state.location} interest={this.state.interest} default_search={this.state.search_cat} 
					change={this.search} user={this.state.user} following={this.following} token={this.state.token} setCookie={this.setCookie}/>
				</React.Fragment>
			)
		}
		
	}
}
