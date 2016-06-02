var React = require('react');
var Battle = require('../components/Battle');
var serverConnector = require('../server/serverConnector');
var Websocket = require('react-websocket');

var BattleContainer = React.createClass({
	getInitialState: function () {
		return {
			isLoading: true,
			match: 0,
			standoff: [],
			voted: false
		}
	},
	componentDidMount: function () {
		console.log("component mounted");
		serverConnector.getBattleInfo()
			.then(function (battle) {
				this.setState({
					isLoading: false,
					match: battle.data.match,
					standoff: battle.data.standoff,
					voted: false
				})
			}.bind(this))
	},
	handleServerData: function (battle) {
		console.log("handling server data");
		this.setState({
			isLoading: false,
			match: battle.match,
			standoff: battle.standoff,
			voted: this.state.voted
		})
	},
	handleVote: function (bandId) {
		console.log("Voting for band " + bandId);
		serverConnector.reportVote(bandId);
	},
	render: function () {
		return (
			<div>
				<Websocket url='ws://localhost:3399/v1/match-ws'
						   onMessage={this.handleServerData}/>
				<Battle isLoading={this.state.isLoading}
						match={this.state.match}
						standoff={this.state.standoff}
						hasVoted={this.state.voted}
						onVote={this.handleVote} />
			</div>
		)
	}
});

module.exports = BattleContainer;