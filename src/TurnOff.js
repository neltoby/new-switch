import React from 'react';

export default class TurnOff extends React.Component {
	state = {
		detail: this.props.detail,
		change: false
	}
	change = (id) => {
		this.setState({
			change: true
		});
		setTimeout(()=>{
			this.props.change(id);
		},3000)
		// this.props.change(id);
	}

	render() {
		let id = this.state.detail.uid;
		let src = `http://localhost:8080/newSwitch/Profile/${this.state.detail.upix}`;
		let onstyle = {
			border: '1px solid #7289da',
			color: '#fff',
			backgroundColor: '#7289da',
		}
		let change = !this.state.change ? 
		<React.Fragment>
		<b> {this.state.detail.uname}</b>
		<div className='turn-change'>
			<span className='turn-change' style={onstyle} onClick={()=>this.change(id)}>Turn on</span>
		</div>
		</React.Fragment> : 
		<div className='turned-on'>
			You have turned On {this.state.detail.uname}
		</div>;
		// let num = !this.state.change ? 1 : 0 ;
		let offstyle = {
			border: '1px solid #7289da',
			color: '#7289da',
			backgroundColor: '#fff',			
		}
		
		let spanColor = this.state.change ? offstyle : onstyle;
		return (
			<React.Fragment>
				<div className='row turn-off-container'>
					<div className='col-3'>
						<img src={src} width='80' height='80' className='turm-img' alt='Profile pic'/>
					</div>
					<div className='col-7 turn-off-name'>
						{change}
					</div>
					<div className='col-2'>
					</div>
				</div>
				
			</React.Fragment>
		);
	}
}
