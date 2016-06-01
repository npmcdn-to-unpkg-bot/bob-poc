var React = require('react');
var Battle = require('../components/Battle');
var serverConnector = require('../server/serverConnector');

var BattleContainer = React.createClass({
	getInitialState: function () {
		return {
			isLoading: true
		}
	},
	componentDidMount: function () {
		serverConnector.getBattleInfo()
			.then(function (battle) {
				this.setState({
					isLoading: false
				})
			}.bind(this))
	},
	render: function () {
		return (
			<Battle isLoading={this.state.isLoading}/>
		)
	}
});

module.exports = BattleContainer;