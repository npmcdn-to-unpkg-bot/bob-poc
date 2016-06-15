var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;
var hashHistory = ReactRouter.hashHistory;
var Main = require('../components/Main');
var BattleContainer = require('../containers/BattleContainer');
var BandUpload = require('../components/BandUpload');

var routes = (
	<Router history={browserHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={BattleContainer} />
			<Route path="uploadSong" component={BandUpload} />
		</Route>
	</Router>
);

module.exports = routes;