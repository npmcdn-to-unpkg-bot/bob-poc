var React = require('react');

var BandDetailsWrapper = function (props) {
	return (<div className='col-sm-6'>
				<p className='lead'>{props.header} - Votes {props.votes}</p>
				{props.children}				
			</div>)
}

module.exports = BandDetailsWrapper;