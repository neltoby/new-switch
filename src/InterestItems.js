import React from 'react';

const InterestItems = (props) => {
	let thick = props.thick ? 'shared-items shared-thick': 'shared-items';
  return (
    <React.Fragment>
		<span className={thick}>{props.item}</span>
	</React.Fragment>

  )
}

export default InterestItems;
