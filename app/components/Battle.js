var React = require('react');
var PropTypes = React.PropTypes;
var styles = require('../styles');
var BandDetails = require('./BandDetails');
var BandDetailsWrapper = require('./BandDetailsWrapper');
var Link = require('react-router').Link;
var MainWrapper = require('./MainWrapper');
var Loading = require('./Loading');

function Battle (props) {
	console.log(props);
	return (
		props.isLoading === true
			? 	<Loading />
			:	<MainWrapper>
					<h1>Round {props.match}</h1>
					<div className='col-sm-8 col-sm-offset-2'>
						{props.standoff.map(function (band) {
							return (<BandDetailsWrapper header={band.name} votes={band.votes} key={band.name + '-' + props.match + '-' + band.votes}>
										<BandDetails
											bandId={band.id}
											avatarUrl="https://scontent.xx.fbcdn.net/t31.0-8/12697237_10153297954690264_675506397102150072_o.jpg"
											soundcloudUrl="https://soundcloud.com/redkaukasus/virago"
											hasVoted={props.hasVoted}
											onVote={props.onVote} />
									</BandDetailsWrapper>)
						})}
					</div>
				</MainWrapper>
	)
}

module.exports = Battle;