var React = require('react');

var Player = React.createClass({
    componentDidMount: function() {
        SC.oEmbed(this.props.soundcloudUrl, {
            maxHeight: "100",
            element: document.getElementById('soundCloudDiv' + this.props.bandId)
        });
    },
    render: function () {
        return (<div id={"soundCloudDiv" + this.props.bandId}></div>)
    }
});

module.exports = Player;