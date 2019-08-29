import React from 'react';
import Loadable from 'react-loadable';
import LoadSelect from './LoadSelect';

const LoadMap = Loadable({
	loader: () => import('./LoadMap'),
	loading: 'Loading'
})
// const LoadSelect = Loadable({
// 	loader: () => import('./LoadSelect'),
// 	loading: 'Loading'
// })

export default class LocOptions extends React.Component {
	state= {
		checked: false,
	}
	onChange = e => {
		this.setState({
			checked: e.target.checked
		});
	}
	setLocation = (current,country,state,municipal) => {
		this.props.setLocation(current,country,state,municipal);
	}
	close = () => {
		this.props.close();
	}

	render() {
		let style = {
			textAlign: 'left',
			paddingTop: '0.5rem',
			paddingBottom: 0,
		}
		let map = this.state.checked ? <LoadMap /> : <LoadSelect setLocation={this.setLocation} close={this.close}/> ;
		return (
			<React.Fragment>
				<div className='custom-control custom-switch' style={style}>
					<input type='checkbox' className='custom-control-input' id='customCheck' style={{fontSize: '30px !important'}} 
					value={this.state.checked} onChange={this.onChange}/>
					<label className='custom-control-label' htmlFor='customCheck'>
					<h4>Use Map</h4>
					</label>
				</div>
				<hr/>
				{map}
			</React.Fragment>
		);
	}
}
