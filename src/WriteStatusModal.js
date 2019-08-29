import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './WriteStatusModal.css';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

export default class WriteStatusModal extends React.Component {
	state = {
		status: this.props.status,
		location: this.props.location,
		interest: this.props.interest,
		modal: this.props.modal,
		shortPlaceholder: this.props.shortPlaceholder,
		error: this.props.error,
		pic: this.props.pic,
		icons: this.props.icons
	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.location !== prevState.location || nextProps.interest !== prevState.interest ||
			nextProps.status !== prevState.status || nextProps.modal !== prevState.modal || 
			nextProps.shortPlaceholder !== prevState.shortPlaceholder || nextProps.error !== prevState.error ||
			nextProps.pic !== prevState.pic || nextProps.icons !== prevState.icons){
			return{
				location: nextProps.location,
				interest: nextProps.interest,
				status: nextProps.status,
				modal: nextProps.modal,
				shortPlaceholder: nextProps.shortPlaceholder,
				error: nextProps.error,
				pic: nextProps.pic,
				icons: nextProps.icons,
				showEmojis: false,
			}
		}
		return null;
	}
	onChange = (e) => {
		this.props.onChange(e.target.value);
		let ctl = document.getElementById('status-textbox');
		let startPos = ctl.selectionStart;
		let endPos = ctl.selectionEnd;
	}
	close = () => {
		this.props.close();
	}
	showEmojis = (e) => {
	    this.setState({
	        showEmojis: true
	    }, () => document.addEventListener('click', this.closeMenu))
	}

    closeMenu = (e) => {
	    console.log(this.emojiPicker)
	    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
	        this.setState({
		        showEmojis: false
		    }, () => document.removeEventListener('click', this.closeMenu))
	    }
	} 
	
	addEmoji = (e) => {
	    console.log(e.unified)
	    let sym = e.unified.split('-')
	    let codesArray = []
	    sym.forEach(el => codesArray.push('0x' + el))
	    let emojiPic = String.fromCodePoint(...codesArray) //("0x1f3f3", "0xfe0f")
		let ctl = document.getElementById('status-textbox');
		let startPos = ctl.selectionStart;
		// let endPos = ctl.selectionEnd;		
		let newStr = this.state.status.slice(0, startPos) + emojiPic + this.state.status.slice(startPos) 
		this.props.onChange(newStr);	    

	}
	render() {
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.pic}`;
		let send = this.state.icons ? ['far', 'paper-plane'] : 'feather-alt';
		let num = !this.state.status.length ? 0 : this.state.status.length;	
		const customEmojis = [
			{
			    name: 'Octocat',
			    short_names: ['octocat'],
			    text: '',
			    emoticons: [],
			    keywords: ['github'],
			    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7',
			}]
	
		const styles = {
			getEmojiButton: {
			    cssFloat: 'right',
			    border: 'none',
			    margin: 0,
			    cursor: 'pointer',
		},
			emojiPicker: {
			    position: 'absolute',
			    bottom: 0,
			    right: 0,
			    cssFloat: 'right',
			    marginLeft: '200px',
			}
		}
		return (
			<div className='status-modal' style={{display: this.state.modal}}>
				<div className='status-modal-content'>
					<div className='status-modal-head'>
						<div className='row row-modal-head'>
							<div className='col-3'>
								<img src={src} alt='profile pic' className='status-profile'/>
							</div>
							<div className='col-7 status-modal-wall-title'>	
								<span className='status-modal-wall-title'>
									<b>{this.state.interest} wall status</b>
								</span>				
							</div>
							<div className='col-2'>
								<span className='status-modal-close' onClick={this.close}>&times;</span>
							</div>
						</div>
					</div>
					<div className='status-modal-body'>
						<div className='row status-textarea'>
							<div className="input-group mb-3 wrt-grp status-grp">
							    <textarea id='status-textbox' value={this.state.status} onChange={this.onChange} placeholder={this.state.shortPlaceholder} 
							    className='form-control' maxLength='150' rows='5'></textarea>											    							
							</div>
						</div>
						<div className='row status-row'>
							<div className='col-2'>
							    <span className="input-group-text read-text">
								    {num}/150
							    </span> 
						    </div>						    
							<div className='col-2'>
							    <span className="input-group-text" onClick={()=>this.props.send()}>
							    <FontAwesomeIcon icon={send} color='#7289da' size='2x' /></span> 
							</div>
							<div className='col-8'>
							    {
							        this.state.showEmojis ?
							            <span className="input-group-text span-emoji" ref={el => (this.emojiPicker = el)}>
							                <Picker onSelect={this.addEmoji} />
							            </span>
							        :
							            <span className="input-group-text image-emoji" onClick={this.showEmojis} >
							                <FontAwesomeIcon icon={['far','smile']} color='#7289da' size='2x' />
							            </span>
								} 
							</div>
						</div>
						<div className='status-error'>{this.state.error}</div>
					</div>
				</div>
			</div>
		);
	}
}
