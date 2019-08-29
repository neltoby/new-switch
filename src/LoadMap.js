import React from 'react';
import './LoadMap.css';

export default class LoadMap extends React.Component {
	state = {
		loading: true,
	}
	componentDidMount() {
		setTimeout(()=>{
			this.setState({
				loading: false
			});
		},2000);
	}

	render() {
		if(this.state.loading){
			return (
				<div className=''>
					Loading Map ...
				</div>
			);
		}
		return (
			<div className=''>
				<h1>Map Loaded</h1>
			</div>
		);
	}
}
