var React = require('react');
var Battle = require('../components/Battle');
var serverConnector = require('../server/serverConnector');
var Websocket = require('react-websocket');
var serverConfig = require('../config/server').backEndConfig;

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
		console.log("battlecontainer");
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
		this.setState({
			isLoading: false,
			match: battle.match,
			standoff: battle.standoff,
			voted: this.state.voted
		})
	},
	handleVote: function (bandId) {
		// Optimistically update votes so ui renders faster
		var currentStandoff = this.state.standoff;
		var updatedStandoff = currentStandoff.map(function (band) {
			if (band.id === bandId) {
				band.votes = band.votes + 1;
			}

			return band;
		});

		this.setState({
			isLoading: false,
			match: this.state.match,
			standoff: updatedStandoff,
			voted: this.state.voted

		});
		serverConnector.reportVote(bandId);
	},
	render: function () {
		return (
			<div>
				<Websocket url={'ws://' + serverConfig + '/v1/match-ws'}
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