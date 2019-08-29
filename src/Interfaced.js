import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TurnOffModal from './TurnOffModal';
import './Interfaced.css';
import './WriteStatusModal.css';

export default class Interfaced extends React.Component {
	state = {
		interest: this.props.interest,
		all_interest: this.props.all_interest,
		placeholder: this.props.placeholder,
		searchholder: this.props.searchholder,
		search: this.props.searchvalue,
		turnoff: this.props.turnoff,
		modal: false,
		loading: true,
		category: this.props.category

	}
	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.all_interest !== prevState.all_interest || nextProps.interest !== prevState.interest ||
			nextProps.placeholder !== prevState.placeholder || nextProps.searchholder !== prevState.searchholder 
			|| nextProps.search !== prevState.search || nextProps.turnoff !== prevState.turnoff){
			return{
				interest: nextProps.interest,
				all_interest: nextProps.all_interest,
				placeholder: nextProps.placeholder,
				searchholder: nextProps.searchholder,
				search: nextProps.search,
				turnoff: nextProps.turnoff,
				category: nextProps.category
			}
		}
		return null;
	}
	writeModal = () => {
		this.props.writeModal();
	}
	onClick = (default_search) => {
		this.props.onClick(default_search);
	}
	onChange = (e) => {
		this.props.onChange(e.target.value)
	}
	loading = () => {
		this.setState({
			loading: false
		});
	}
	open = () => {
		this.setState({
			modal: true
		});
		setTimeout(() => {
			this.loading();
		},2000)
	}
	close = () => {
		this.setState({
			modal: false,
			loading: true
		});
	}
	change = (id) => {
		this.props.change(id)		
	}

	render() {
		let modal = this.state.modal ? 'block' : 'none';
		let icon = this.state.turnoff.length ?
		<React.Fragment> 
		<FontAwesomeIcon icon={['far','bell-slash']} color='#647489' size='2x' className='turn-off-bell' />
		<sup className='sup-label'><span className='label label-danger turnoff-label'>{this.state.turnoff.length}</span></sup>
		</React.Fragment> : 
		<FontAwesomeIcon icon={['far','bell-slash']} color='#647489' size='2x' className='turn-off-bell' /> ;
		return (
			<React.Fragment>
			<div className='container-fluid form-div'>
				<div className='row fix'>
					<div className='write-span'>
						<span className='write-span-1'  onClick={this.writeModal}>
							<FontAwesomeIcon icon='feather-alt' color='#fff' size='3x' className='span-write'/>
						</span>
					</div>
				</div>
			</div>
			<div className='container-fluid form-div search-head'>
					<div className='row'>
						<div className='col-2 show-turn-off' onClick={this.open}>
							{icon}								
							<span className='item-hover' >
								{this.state.interest} Turn Offs
							</span>
						</div>
						<div className='col-10'>
							<div className="input-group mb-3 ipt-grps">
							    <input type="search" name='search' className='form-control post-input-search' onChange={this.onChange} 
							    	placeholder={this.state.searchholder} value={this.state.search} />
							    <div className="input-group-append input-search">
								    <span className="input-group-text" onClick={()=>this.onClick('People')}>
								    <FontAwesomeIcon icon={['far','user-circle']} color='#647489' size='lg' /></span> 
								</div>
								<div className="input-group-append input-search">
								    <span className="input-group-text" onClick={()=>this.onClick('Post')}>
								    <FontAwesomeIcon icon='feather-alt' color='#647489' size='lg' /></span> 
								</div>
								<div className="input-group-append input-search">
								    <span className="input-group-text" onClick={()=>this.onClick('Group')}>
								    <FontAwesomeIcon icon='user-friends' color='#647489' size='lg' /></span> 
								</div>
								<div className="input-group-append input-search last-input-search">
								    <span className="input-group-text" onClick={()=>this.onClick('Portal')}>
								    <FontAwesomeIcon icon={['far','bookmark']} color='#647489' size='lg' /></span> 
								</div>
						    </div>
					    </div>
				    </div>
				</div>
				<TurnOffModal turnoff={this.state.turnoff} interest={this.state.interest} close={this.close} 
				modal={modal} loading={this.state.loading} change={this.change}/>
			</React.Fragment>
		);
	}
}
