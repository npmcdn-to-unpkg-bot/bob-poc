var React = require('react');
var serverConfig = require('../config/server').frontEndConfig;
var SC = require('soundcloud');

var NavBar = React.createClass({
	handleClick: function() {
		console.log("Clicked!");
		console.log(serverConfig);
		SC.initialize({
			client_id: 'f372d41f0b8cd51c53240982350ab4fb',
			redirect_uri: 'http://' + serverConfig + '/callback.html'
		});

		// initiate auth popup
		SC.connect().then(function() {
			return SC.get('/me');
		}).then(function(me) {
			console.log('Hello, ' + me.username);
		});
	},
	render: function () {return (
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
		      <ul className="nav navbar-nav">
		        <li className="active"><a href="#">Home <span className="sr-only">(current)</span></a></li>
		        <li><a href="#">About</a></li>
		        <li className="dropdown">
		          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
		          <ul className="dropdown-menu">
		            <li><a href="#">Action</a></li>
		            <li><a href="#">Another action</a></li>
		            <li><a href="#">Something else here</a></li>
		            <li role="separator" className="divider"></li>
		            <li><a href="#">Separated link</a></li>
		            <li role="separator" className="divider"></li>
		            <li><a href="#">One more separated link</a></li>
		          </ul>
		        </li>
		      </ul>
		      <ul className="nav navbar-nav navbar-right">
		        <li>
					<button type="button" className="btn btn-default navbar-btn" onClick={this.handleClick}>Sign in</button>
				</li>
		      </ul>
		    </div>
		  </div>
		</nav>)}
});

module.exports = NavBar;