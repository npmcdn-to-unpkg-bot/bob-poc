var React = require('react');
var PropTypes = React.PropTypes;

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
  componentDidMount: function() {
    SC.oEmbed(this.props.soundcloudUrl, {
      maxHeight: "100",
      element: document.getElementById('soundCloudDiv' + this.props.bandId)
    });
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
        <li className="list-group-item"><div id={"soundCloudDiv" + this.props.bandId}></div></li>
      </div>
    )
  }
});

module.exports = BandDetails;