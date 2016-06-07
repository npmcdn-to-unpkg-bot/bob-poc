var React = require('react');
var SC = require('soundcloud');

var Player = React.createClass({
    componentDidMount: function() {
        SC.initialize({
            client_id: 'f372d41f0b8cd51c53240982350ab4fb'
        });
        SC.oEmbed(this.props.soundcloudUrl, {
            element: document.getElementById('soundCloudDiv' + this.props.bandId),
            maxheight: 150,
            buying: false,
            sharing: false,
            show_user: false,
            show_artwork: true
        });
    },
    render: function () {
        return (<div id={"soundCloudDiv" + this.props.bandId}></div>)
    }
});

module.exports = Player;