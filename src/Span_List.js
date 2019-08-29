import React from 'react';
import $ from './jquery-3.2.1';
import './Span_List.css';

export default class Span_List extends React.Component {
	onClick = () => {
		this.props.checkSpanList()	
	}

	render() {
		return(
			<span className='like-span'>
				{this.props.list}
				<span className='cancel-likes' onClick={this.onClick}>&times;</span>
			</span>
			);
		
	}
}
