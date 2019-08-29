import React,{Fragment} from 'react';

const LoginBody = (props) => {
  return (
    <Fragment>
	    <div className= 'col-4-s'>
			<div className= 'c-container-1 text-center'>
				<h1> SWITCH</h1>
				<h3>Be connected to the clouds always</h3><br/>
				<p> <img src={require('./img/1.jpg')} width='100%' height='183' /></p>
				<br/><br/>
				<ul>
				<li><h5>You can be anywhere you want to be with <b>SWITCH</b></h5></li>
				<li><h5>Get trending updates from anyplace of your interest</h5></li>
				<li><h5>Get trending updates from anyplace of your interest</h5></li>
				</ul>
			</div>
		</div>
    </Fragment>
  )
}

export default LoginBody;