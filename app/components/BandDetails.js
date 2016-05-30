var React = require('react');
var PropTypes = React.PropTypes

var BandDetails = React.createClass({
  propTypes: {
    avatar_url: PropTypes.string.isRequired,
    soundcloud_url: PropTypes.string.isRequired
  },
  componentDidMount: function() {
    SC.oEmbed(this.props.soundcloud_url, {
      maxHeight: "100",
      element: document.getElementById('soundCloudDiv' + this.props.band_id)
    });
  },
  render: function () {
    return (
      <div>
        <li className="list-group-item"> <img src={this.props.avatar_url} className="img-rounded img-responsive"/></li>
        <div id={"soundCloudDiv" + this.props.band_id}></div>
      </div>
    )
  }
});

module.exports = BandDetails;