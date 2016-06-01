var React = require('react');
var Battle = require('../components/Battle');
var serverConnector = require('../server/serverConnector');

var BattleContainer = React.createClass({
	getInitialState: function () {
		return {
			isLoading: true,
			match: 0,
			standoff: []
		}
	},
	componentDidMount: function () {
		serverConnector.getBattleInfo()
			.then(function (battle) {
				console.log("BATTLE", battle);
				this.setState({
					isLoading: false,
					match: battle.data.match,
					standoff: battle.data.standoff
				})
			}.bind(this))
	},
	render: function () {
		return (
			<Battle isLoading={this.state.isLoading} match={this.state.match} standoff={this.state.standoff} />
		)
	}
});

module.exports = BattleContainer;