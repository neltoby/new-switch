import React from 'react';

export default class Span extends React.Component {
	state = {
		less: true
	}
	change = () => {
		if(this.state.less){
			this.props.colorChange();
		}else{
			this.props.colorOut();
		}
		this.setState({
			less: !this.state.less
		});
	}
	onClick = () => {
		this.props.onClick();
	}

	render() {
		let less = {
			backgroundColor: '#fff',
			color: '#647489',
			fontSize: '1.5rem',
			border: '1px solid #647489',
			borderRadius: '180px',
			padding: '0.5rem 1rem',
			margin: '1rem 2rem',
			cursor: 'pointer'
		}
		let more = {
			backgroundColor: '#647489',
			color: '#fff',
			fontSize: '1.5rem',
			border: '1px solid #647489',
			borderRadius: '180px',
			padding: '0.5rem 1rem',
			margin: '1rem 2rem',
			cursor: 'pointer'
		}
		let style = this.state.less ? less : more ;
		let dispan = {
			marginRight: '0.6rem',
			marginLeft: '0.6rem',
			cursor: 'pointer'
		}
		if(this.props.check){
			return(
				<span style = {more}>
					<span className='span-item'>
						{this.props.item}
					</span>
					<span style={dispan} onClick={this.onClick}>&times;</span>
				</span>
				)
		}
		return(
			<span style = {style} onClick={this.change}>
				<span className='span-item'>{this.props.item}</span> 
			</span>
		)
		
	}
}
