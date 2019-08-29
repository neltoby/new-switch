import React from 'react';

export default class NewForm extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='container-fluid form-div' onClick={this.writeModal}>
				<div className='row empty-row'>
					<b>{this.state.interest} &nbsp;&nbsp;- &nbsp;&nbsp;{this.state.all_interest}</b>
				</div>
				<div className='row empty-row foms-rows'>
					<div className='row'>
						<div className='col-8 col-f'>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
							        <span className="input-group-text"><FontAwesomeIcon icon='feather-alt' color='gray' size='2x'/></span>
							    </div>
								<input type='text' className='input-post form-control' readOnly
								name='post' placeholder={placeholder} />
							</div>
						</div>
						<div className='col-4 col-s'>
							<div className="input-group mb-3">
								<div className="input-group-prepend">
							        <span className="input-group-text"><FontAwesomeIcon icon='tag' color='gray' size='2x'/></span>
							    </div>
								<input type='text' className='input-tag form-control' readOnly
								name='tag' title='Tag / Title' placeholder='Tag / Title' />
							</div>
						</div>
					</div>
					<div className='row rows'>						
						<div className='col-3 round'>
							<span className='round sp-f'>
								<FontAwesomeIcon icon='camera-retro' className='upload-pic' color='#647489' size='1x'/>
							</span>
						</div>
						<div className='col-3 round sp-s'>
							<span className='round'>
								<FontAwesomeIcon icon='paper-plane' className='send-post' color='#647489' size='1x'/>
							</span>
						</div>
						<div className='col-6'>
							<button className='btn btn-default btn-defaults form-control' style={{marginRight: '15%',marginLeft: '15%',border: '3px solid #ddd',fontWeight: 600}} type='button'> Trending {this.state.interest} Threads </button>
						</div>
					</div>
				</div>											
			</div>
			--------------------------------------------------------------------------------------------------------------------
			////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			<div className='row empty-row-m'>
				<b>{this.state.interest} &nbsp;&nbsp;- &nbsp;&nbsp;{this.state.all_interest}</b>					
			</div>
			{error}
			<div className='row empty-row foms-rows'>
				<div className='row row-end'>
					<div className='col-8 col-f-m'>
						<div className="input-group mb-3">
							<div className="input-group-prepend">
						        <span className="input-group-text"><FontAwesomeIcon icon='feather-alt' color='gray' size='2x'/></span>
						    </div>
							<input type='text' className='input-post-m form-control' name='post' placeholder={placeholder} 
							value={this.state.post} onChange={this.onChange} />
						</div>
					</div>
					<div className='col-4 col-s-m'>
						<div className="input-group mb-3">
							<div className="input-group-prepend">
						        <span className="input-group-text"><FontAwesomeIcon icon='tag' color='gray' size='2x'/></span>
						    </div>
							<input type='text' className='input-tag-m form-control' name='tag' value={this.state.tag} 
							onChange={this.onChange} title='Tag / Title' placeholder='Tag / Title' />
						</div>
					</div>
				</div>
				<div className='row rows-m'>						
					<div className='col-3 round'>
						<input type='hidden' name='interest' value={this.state.interest}/>
						<input type='hidden' name='pid' value={id} />
						<input type='hidden' name='current' value={this.state.location.current}/>
						<input type='hidden' name='thread' value={this.state.threadId} />
						<input type='hidden' name='country' value={this.state.location.country}/>
						<input type='hidden' name='state' value={this.state.location.state}/>
						<input type='hidden' name='municipal' value={this.state.location.municipal}/>
						<label htmlFor='file'>
							<span className='round'>
								<FontAwesomeIcon icon='camera-retro' className='upload-pic' color='#647489' size='1x'/>
							</span>
						</label>
						<input type='file' name='file[]' id='file' style={{display: 'none'}} multiple
						onChange={this.handleFileOnChange} value={this.state.file} />
					</div>
					<div className='col-3 round'>
						<span className='round'>
							<button type='submit' name='submit' className='btn btn-default'>
								<FontAwesomeIcon icon='paper-plane' className='send-post' color='#647489' size='1x'/>
							</button>
						</span>
					</div>
					<div className='col-6'>
						<span className='btn-span'>
							<button className='btn btn-default btn-defaults form-control' onClick={this.visible} 
							style={{marginRight: '15%',marginLeft: '15%',border: '3px solid #ddd',fontWeight: 600}} type='button'> Trending {this.state.interest} Threads </button>
						</span>
					</div>
				</div>
					{spanThread }
					<div className = 'row'>
						{display_text}
						{thread_details}
					</div>
			</div>
		);
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
		let placeholder = `Talk ${this.state.interest} in ${lastItem}`;
		let searchholder = `Search ${lastItem} on ${this.state.interest}`;
		let heading = this.state.category == 'post' && this.state.posts.length ?  
		`Followers In ${lastItem} On ${this.state.interest}` : 
		`People You Could Follow in ${lastItem} On ${this.state.interest}`;
		let Interfaced = this.state.category == 'post' && this.state.posts.length ? 
			<Interfaced interest={this.state.interest} all_interest={this.state.all_interest} 
				placeholder={placeholder} writeModal={this.writeModal} searchholder={searchholder} 
				searchvalue={this.state.search} onClick={this.search} onChange={this.onChange}/> : '' ;
		let tag = this.state.tag ? <input type='text' name='tag' placeholder='Tag Post' value={this.state.tagtext} 
				className='form-control thread-tag' onChange={this.onChange}/>: '' ;
		let tagErr = this.state.errorStatus == 'tag' ? this.state.error : '' ;
		let postErr = this.state.errorStatus == 'post' ? this.state.error : '' ;
		console.log(this.state.post);
		// ${this.state.interest} Post From Followers in ${lastItem}
		let post = this.state.category == 'post' && this.state.posts.length ? this.state.posts.map((post,i) => {
			// console.log(post);
			return(
				<NewPost post={post} key={i} updateComment={this.updateComment} newPost={this.newPost} thread={this.thread}
				likes={this.likes} interest={this.state.interest} location={this.state.location} all={this.state.all_followers}
				interestF={this.state.interest_followers} locationF={this.state.location_followers} editEpost={this.editEpost}
				intLocation={this.state.interest_location} follow={this.follow} sendEdit={this.sendEdit} editEtag={this.editEtag} 
				saved={this.saved} report={this.report}/>
				);
		}) : this.state.people.map((pple,i)=>{
			return(
				<People />
				);
		})
		if(this.state.default){
			return (
				<React.Fragment>
					{Interfaced}					
					<div className='posts-heading'>
						<h2>{heading}</h2>
					</div>
					<div className='posts'>
						{post}
					</div>	
					
					<WriteModal location={this.state.location} interest={this.state.interest} newPost={this.newPost}
					 all_interest={this.state.all_interest}/>

				</React.Fragment>
			);
		}else{
			return(
				<div className='container-fluid form-div search-heading'>
					<div className="row row-write">
						<div className="col-1 write-span" onClick={this.write}>
							<span className='write-span'>
								<FontAwesomeIcon icon='feather-alt' color='#fff' size='2x' className='span-write'/>
							</span>
						</div>
						<div className="col-11 col-11-search">
							<div className="input-group mb-3 ipt-grp">
							    <input type="search" name='search' className='form-control input-search' onChange={this.onChange} 
							    	placeholder={searchholder} value={this.state.search} />
							    <div className="input-group-append input-search">
								    <span className="input-group-text" onClick={this.search}><FontAwesomeIcon icon='search' color='#7289da' size='lg' /></span> 
								</div>
						    </div>
					    </div>
				    </div>
				</div>
			)
		}
		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	<div className='col-11'>
		<div className="input-group mb-3 ipt-grps">
		    <textarea name='post' placeholder={this.state.placeholder}
			className='form-control post-textarea' readOnly rows='1'></textarea>
		    <div className="input-group-append input-search">
			    <span className="input-group-text">
			    <FontAwesomeIcon icon='thread-tag-icon' color='#45505f' size='lg' />
			    </span> 
			</div>
			<div className="input-group-append input-search">
			    <span className="input-group-text">
			    <FontAwesomeIcon icon={['far', 'images']} color='#45505f' size='lg' />
			    </span> 
			</div>
			<div className="input-group-append input-search">
			    <span className="input-group-text">
			    <button type='button' className='btn btn-primary'>
					Post
				</button>
			    </span> 
			</div>
	    </div>
		
	</div>
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Dear Sir/Madam,

As a web developer  for about 3years now, i have worked towards completing  projects right from start and also worked as 
a part of a team. I have what it takes to deliver even when even the subject is an uncharted territory. I know how to make 
things work and i believe i my  experience and capacity would be nothing less than an additional skate on your company's 
performance