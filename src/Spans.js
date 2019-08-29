import React from 'react';

const Spans = (props) => {
	let dip = `w3-badge ${props.pid}demo w3-border w3-hover-white`;
	return(
	<span className={dip} onClick={props.currentDiv}></span>
	);
}

export default Spans;