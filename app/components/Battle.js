var React = require('react');
var PropTypes = React.PropTypes;
var styles = require('../styles');
var BandDetails = require('./BandDetails');
var BandDetailsWrapper = require('./BandDetailsWrapper');
var Link = require('react-router').Link;
var MainWrapper = require('./MainWrapper');
var Loading = require('./Loading');

function Battle (props) {
	return (
		props.isLoading === true
			? 	<Loading />
			:	<MainWrapper>
					<h1>Round 1</h1>
					<div className='col-sm-8 col-sm-offset-2'>
						<BandDetailsWrapper header="Band 1" votes={3}>
							<BandDetails
								band_id={1}
								avatar_url="https://scontent.xx.fbcdn.net/t31.0-8/12697237_10153297954690264_675506397102150072_o.jpg"
								soundcloud_url="https://soundcloud.com/redkaukasus/virago" />
						</BandDetailsWrapper>
						<BandDetailsWrapper header="Band 2" votes={6}>
							<BandDetails
								band_id={2}
								avatar_url="https://scontent.xx.fbcdn.net/t31.0-8/12697237_10153297954690264_675506397102150072_o.jpg"
								soundcloud_url="https://soundcloud.com/redkaukasus/veil-kite" />
						</BandDetailsWrapper>
					</div>
				</MainWrapper>
	)
}

module.exports = Battle;