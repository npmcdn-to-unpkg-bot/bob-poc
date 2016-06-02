var React = require('react');
var PropTypes = React.PropTypes;
var Player = require('./Player');

function BandImage (props) {
  var styles = {
    imgPointer: {
      cursor: 'pointer'
    }
  };

  return (
      props.hasVoted
          ? <img src={props.avatarUrl} className="img-rounded img-responsive" />
          : <img src={props.avatarUrl} className="img-rounded img-responsive" onClick={props.onVote.bind(null, props.bandId)} style={styles.imgPointer} />
  )
}

var BandDetails = React.createClass({
  propTypes: {
    avatarUrl: PropTypes.string.isRequired,
    soundcloudUrl: PropTypes.string.isRequired
  },
  render: function () {
    return (
      <div>
        <li className="list-group-item">
          <BandImage hasVoted={this.props.hasVoted}
                     onVote={this.props.onVote}
                     avatarUrl={this.props.avatarUrl}
                     bandId={this.props.bandId} />
        </li>
        <li className="list-group-item"><Player bandId={this.props.bandId} soundcloudUrl={this.props.soundcloudUrl} /></li>
      </div>
    )
  }
});

module.exports = BandDetails;