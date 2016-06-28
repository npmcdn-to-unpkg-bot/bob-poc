var React = require('react');
var serverConfig = require('../config/server').frontEndConfig;
var SC = require('soundcloud');
var Link = require('react-router').Link;
var soundCloudId = require('../config/server').soundCloudId;
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

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

	var loggedInAs = props.isConnected ? <li><a href={props.loggedUser.permalink_url}>Logged in as {props.loggedUser.username}</a></li> : null;
	var loggedUserLinks = props.isConnected ? <li><Link to={{ pathname: '/uploadSong',  query: {bandId: props.loggedUser.id} }}><button type="button" className="btn btn-sm btn-success">Upload a song</button></Link></li> : null;

	return (
			<ul className="nav navbar-nav navbar-right">
				{loggedInAs}
				{loggedUserLinks}
				<li>
					<a style={{ cursor: 'pointer' }} onClick={soundCloudButtonProps.clickHandler}>
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
			loggedIn: false,
			loggedUser: null,
			logout: false
		}
	},
	connectToSoundCloud: function() {
		// initiate auth popup
		SC.connect().then(function() {
			return SC.get('/me');
		}).then(function(me) {
			this.setState(Object.assign(this.state, {loggedUser: me, loggedIn: true}));
		}.bind(this));
	},
	onLogout: function () {
		this.setState(Object.assign(this.state, {logout: true}));
	},
	cancelLogout: function () {
		this.setState(Object.assign(this.state, {logout: false}));
	},
	disconnectFromSoundCloud: function() {
		this.setState(Object.assign(this.state, {loggedUser: null, loggedIn: false, logout: false}));
	},
	close: function () {
		var currState = this.state;
		currState.songSubmitted = false;
		this.setState(currState);

		this.context.router.push({ pathname: '/' });
	},
	componentDidMount: function() {
		SC.initialize({
			client_id: soundCloudId,
			redirect_uri: 'http://' + serverConfig + '/callback.html'
		});
	},
	render: function () {
		return (
			<div>
				<NavBarWrapper isConnected={this.state.loggedIn}
							   handleLoginClick={this.connectToSoundCloud}
							   handleLogoutClick={this.onLogout}
							   loggedUser={this.state.loggedUser} />
				<Modal show={this.state.logout}>
					<Modal.Body>
						<h4>Are you sure you want to log out?</h4>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.disconnectFromSoundCloud}>OK</Button>
						<Button onClick={this.cancelLogout}>Cancel</Button>
					</Modal.Footer>
				</Modal>
			</div>
			)}
});

module.exports = NavBar;