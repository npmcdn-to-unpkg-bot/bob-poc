var React = require('react');
var transparentBg = require('../styles').transparentBg;
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var MainContainer = require('../containers/MainContainer');

var Home = React.createClass({
	render: function() {
		return (
			<MainContainer>
				<h1>Battle of Bands!</h1>
			</MainContainer>
		)
	}
});

module.exports = Home;a