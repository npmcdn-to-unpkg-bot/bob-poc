var React = require('react');
var Battle = require('../components/Battle');
var serverConnector = require('../server/serverConnector');
var Websocket = require('react-websocket');

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
	handleData: function (data) {
		this.setState({
			isLoading: false,
			match: data.match,
			standoff: data.standoff
		})
	},
	render: function () {
		return (
			<div>
				<Websocket url='ws://localhost:3399/v1/match-ws'
						   onMessage={this.handleData}/>
				<Battle isLoading={this.state.isLoading} match={this.state.match} standoff={this.state.standoff} />
			</div>
		)
	}
});

module.exports = BattleContainer;