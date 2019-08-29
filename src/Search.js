import React from 'react';
import $ from './jquery-3.2.1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchPeople from './SearchPeople';
import SearchPost from './SearchPost';
import SearchGroup from './SearchGroup';
import SearchPortal from './SearchPortal';
import './Search.css';

export default class Search extends React.Component {
	state = {
		searchholder: this.props.searchholder,
		search: this.props.search,
		location: this.props.location,
		interest: this.props.interest,
		default_search: this.props.default_search,
		search_res: []
	}
	componentDidMount() {
		this.getSearch(this.state.default_search);
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.interest !== prevState.interest ||
			nextProps.search !== prevState.search || nextProps.searchholder !== prevState.searchholder || 
			nextProps.default_search !== prevState.default_search){
			return{
				location: nextProps.location,
				interest: nextProps.interest,
				search: nextProps.search,
				searchholder: nextProps.searchholder,
				default_search: nextProps.default_search
			}
		}
		return null;
	}
	componentDidUpdate(prevProps, prevState) {
		if(prevState.location !== this.state.location || prevState.interest !== this.state.interest || 
			prevState.search !== this.state.search || prevState.default_search !== this.state.default_search){
			this.getSearch(this.state.default_search);
		}
	}
	getSearch = (category) => {
		let id = localStorage.set_id;
		let interest = this.state.interest;
		let current = this.state.location.current;
		let country = this.state.location.country;
		let state = this.state.location.state;
		let local = this.state.location.municipal;
		let search = this.state.search;
		let info;
		if(current == 'country'){
			info = {interest: interest, id: id, current: current, 
				country: country, category: category, search: search};
		}else if(current == 'state'){
			info = {interest: interest, id: id, current: current, 
				country: country, state: state, category: category, search: search}; 
		}else if(current == 'local'){
			info = {interest: interest, id: id, current: current, search: search ,
				country: country, state: state, local: local, category: category}; 
		}
		$.ajax({
        	url: "http://localhost:8080/newSwitch/Codelet/getSearch.php",
		    type: "POST",
			data: info,
			beforeSend: () => {
				this.setState({
					search_res: []
				});
			},
			success: (response) => {
				if(response){
					if(response != 'null'){
						let res = JSON.parse(response);
						console.log(res);
						this.setState({
							search_res: res.all 
						});
					}else{
						this.setState({
							search_res: []
						});
					}
				}
			
			},
			error: () => {

			}    			
        });
 	}
	write = () => {
		this.props.write();
	}
	onChange = (e) => {
		this.props.onChange(e.target.value);
	}
	change = (default_search) => {
		this.setState({
			search_res: []
		});
		this.props.change(default_search);
		// this.getSearch(default_search);
	}
	following = (num,amt) => {
		this.props.following(num,amt);
	}
	follow = (id,num) => {
		this.following(num,1);
		const follow = this.state.search_res.map((post,i)=>{
			if(post.uid === id){
				console.log(num+' was called');
				if(num === 1){
					return Object.assign({}, post, {
						following: true
					})
				}else{
					return Object.assign({}, post, {
						following: false
					})
				}
			}else{
				return post;
			}
		})

		console.log(follow);
		this.setState({
			search_res: follow
		});

	}

	render() {
		let lastItem = '';
		if(this.state.location.current == 'local'){
			lastItem = this.state.location.municipal;
		}else if(this.state.location.current == 'state'){
			lastItem = this.state.location.state;
		}else{
			lastItem = this.state.location.country;
		}
		let people_color = this.state.default_search == 'People' ? 'col-2 option-icon active' : 'col-2 option-icon' ;
		let post_color =  this.state.default_search == 'Post' ? 'col-2 option-icon active' : 'col-2 option-icon' ;
		let group_color =  this.state.default_search == 'Group' ? 'col-2 option-icon active' : 'col-2 option-icon' ;
		let portal_color =  this.state.default_search == 'Portal' ? 'col-2 option-icon active' : 'col-2 option-icon' ;
		let title = this.state.search_res.length ? <div className='search-title'>Search result for 
		'<b><i>{this.state.search}</i></b>' in {lastItem} on {this.state.default_search}</div> : 
		<div className='search-title'>No match found for <b>{this.state.search}</b></div> ;
		let display_class = this.state.search_res.map((post,i) => {
			if(this.state.default_search == 'People'){
				return(
					<SearchPeople post={post} key={i} follow={this.follow}/>
					);
			}else if(this.state.default_search == 'Post'){
				return(
					<SearchPost post={post} key={i} search={this.state.search}/>
					);
			}else if(this.state.default_search == 'Group'){
				return(
					<SearchGroup post={post} key={i} />
					)
			}else if(this.state.default_search == 'Portal'){
				return(
					<SearchPortal post={post} key={i} />
					)
			}
		})
		return (
			<div className='container-fluid form-div search-heading'>
				<div className="row row-write">
					<div className="col-1 write-span" onClick={this.write}>
						<span className='write-span'>
							<FontAwesomeIcon icon='feather-alt' color='#fff' size='2x' className='span-write'/>
						</span>
					</div>
					<div className="col-11 col-11-search">
						<div className="input-group mb-3 ipt-grps">
						    <input type="search" name='search' className='form-control input-search' onChange={this.onChange} 
						    	placeholder={this.state.searchholder} value={this.state.search} />
						    <div className="input-group-append input-search">
							    <span className="input-group-text" onClick={()=>this.change('People')}>
							    <FontAwesomeIcon icon='search' color='#45505f' size='lg' /></span> 
							</div>
					    </div>
				    </div>
			    </div>
			    <div className='row search-option'>
				    <div className="col-4 search-result-option">
					    <b>{this.state.default_search}</b>
				    </div>
				    <div className={people_color} onClick={()=>this.change('People')}>
					    <FontAwesomeIcon icon={['far','user-circle']} color='#7289da' size='2x' className='search-icon'/>
					    <span className='lists'>People</span>
				    </div>
				    <div className={post_color} onClick={()=>this.change('Post')}>
					    <FontAwesomeIcon icon='feather-alt' color='#7289da' size='2x' className='search-icon'/>
					    <span className='lists'>Post</span>
				    </div>
					<div className={group_color} onClick={()=>this.change('Group')}>
					    <FontAwesomeIcon icon='user-friends' color='#7289da' size='2x' className='search-icon'/>
					    <span className='lists'>Group</span>
				    </div>
				    <div className={portal_color} onClick={()=>this.change('Portal')}>
					    <FontAwesomeIcon icon={['far','bookmark']} color='#7289da' size='2x' className='search-icon'/>
					    <span className='lists'>Portal</span>
				    </div>
			    </div>
					{title}
			    <div className='row search-option'>
				    {display_class}
			    </div>
			</div>
		);
	}
}
