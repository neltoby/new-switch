import React from 'react';
import './SpanReply.css';
import {NavLink} from 'react-router-dom';

const SpanReply = (props) => {
	if(props.sides){
	    return (
		    <span className='reply-container'>
			    <span className='reply-name'>
				    {props.name}
			    </span>
			    <span className='reply-close' onClick={()=>props.deleteReply(props.name,props.id)}>
					&times;
			    </span>
		    </span>
	    )
	}else{
		if(props.refer){
			return (
				<span className='reply-container-refer'>
					<NavLink to={`/profile/${props.name}`} className='namelink'>@{props.name}</NavLink>
				</span>
			)
		}else{
			return (
				<span className='reply-container-i'>
					{props.name}
				</span>
			)
		}
	}
}

export default SpanReply;