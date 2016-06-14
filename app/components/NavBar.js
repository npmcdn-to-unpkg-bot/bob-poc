var React = require('react');
var serverConfig = require('../config/server').frontEndConfig;
var SC = require('soundcloud');

function LeftSideNav (props) {
	var loggedUserLinks = props.isConnected ? <li><a href="#">Upload a song</a></li> : null;
	return (
		<ul className="nav navbar-nav">
			<li className="active"><a href="#">Home <span className="sr-only">(current)</span></a></li>
			{loggedUserLinks}
		</ul>
	)
};

function RightSideNav (props) {
	var soundCloudButtonProps = props.isConnected ?
		{
			clickHandler: props.handleLogoutClick,
			imageSrc: "http://" + serverConfig + "/SC-disconnect.png",
			imageAlt: "Logout from SoundCloud"
		} :
		{
			clickHandler: props.handleLoginClick,
			imageSrc: "http://" + serverConfig + "/SC-connect.png",
			imageAlt: "Login with SoundCloud"
		};

	var loggedInAs = props.isConnected ? <li><a href={props.userUrl}>Logged in as {props.loggedInAs}</a></li> : null;

	return (
			<ul className="nav navbar-nav navbar-right">
				{loggedInAs}
				<li>
					<a href="#" onClick={soundCloudButtonProps.clickHandler}>
						<img src={soundCloudButtonProps.imageSrc} alt={soundCloudButtonProps.imageAlt} />
					</a>
				</li>
			</ul>
	)
};

var NavBar = React.createClass({
	getInitialState: function () {
		return {
			isLoggedIn: false,
			loggedInAs: null,
			userUrl: null
		}
	},
	connectToSoundCloud: function() {
		// initiate auth popup
		SC.connect().then(function() {
			return SC.get('/me');
		}).then(function(me) {
			console.log("Logged in " + me.username);
			console.log(me);
			this.setState({
				isLoggedIn: true,
				loggedInAs: me.username,
				userUrl: me.permalink_url
			});
		}.bind(this));
	},
	disconnectFromSoundCloud: function() {
		sessionStorage.clear();
		this.setState({
			isLoggedIn: false,
			loggedInAs: null,
			userUrl: null
		});
	},
	componentDidMount: function() {
		SC.initialize({
			client_id: 'f372d41f0b8cd51c53240982350ab4fb',
			redirect_uri: 'http://' + serverConfig + '/callback.html'
		});
	},
	render: function () {
		return (
			<nav className="navbar navbar-default">
				<div className="container-fluid">
					<div classNameName="navbar-header">
						                     <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						                       <span className="sr-only">Toggle navigation</span>
						                       <span className="icon-bar"></span>
						                       <span className="icon-bar"></span>
						                       <span className="icon-bar"></span>
						                     </button>
						                     <a className="navbar-brand" href="#">Battle of the Bands</a>
						                   </div>
					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<LeftSideNav isConnected={this.state.isLoggedIn} />
					<RightSideNav isConnected={this.state.isLoggedIn}
								  handleLoginClick={this.connectToSoundCloud}
								  handleLogoutClick={this.disconnectFromSoundCloud}
								  loggedInAs={this.state.loggedInAs}
								  userUrl={this.state.userUrl} />
				</div>
					</div>
			</nav>)}
});

module.exports = NavBar;