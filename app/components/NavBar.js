var React = require('react');
var serverConfig = require('../config/server').frontEndConfig;
var SC = require('soundcloud');
var Link = require('react-router').Link;

function LeftSideNav (props) {
	return (
		<ul className="nav navbar-nav">
			<li className="active"><a href="#">Home <span className="sr-only">(current)</span></a></li>
		</ul>
	)
}

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

	console.log(props.loggedUser);

	var loggedInAs = props.isConnected ? <li><a href={props.loggedUser.permalink_url}>Logged in as {props.loggedUser.username}</a></li> : null;
	var loggedUserLinks = props.isConnected ? <li><Link to={{ pathname: '/uploadSong',  query: {bandId: props.loggedUser.id} }}><button type="button" className="btn btn-sm btn-success">Upload a song</button></Link></li> : null;

	return (
			<ul className="nav navbar-nav navbar-right">
				{loggedInAs}
				{loggedUserLinks}
				<li>
					<a href="#" onClick={soundCloudButtonProps.clickHandler}>
						<img src={soundCloudButtonProps.imageSrc} alt={soundCloudButtonProps.imageAlt} />
					</a>
				</li>
			</ul>
	)
}

function NavBarWrapper (props) {
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
					<LeftSideNav />
					<RightSideNav isConnected={props.isConnected}
								  handleLoginClick={props.handleLoginClick}
								  handleLogoutClick={props.handleLogoutClick}
								  loggedUser={props.loggedUser} />
				</div>
			</div>
		</nav>
	)
}

var NavBar = React.createClass({
	getInitialState: function () {
		return {
			isLoggedIn: false,
			loggedUser: null
		}
	},
	connectToSoundCloud: function() {
		// initiate auth popup
		SC.connect().then(function() {
			return SC.get('/me');
		}).then(function(me) {
			console.log("Logged in " + me.username);
			this.setState({
				isLoggedIn: true,
				loggedUser: me
			});
		}.bind(this));
	},
	disconnectFromSoundCloud: function() {
		sessionStorage.clear();
		this.setState({
			isLoggedIn: false,
			loggedUser: null
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
			<NavBarWrapper isConnected={this.state.isLoggedIn}
						   handleLoginClick={this.connectToSoundCloud}
						   handleLogoutClick={this.disconnectFromSoundCloud}
						   loggedUser={this.state.loggedUser}  />
			)}
});

module.exports = NavBar;