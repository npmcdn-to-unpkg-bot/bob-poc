var React = require('react');
var SC = require('soundcloud');

var BandUpload = React.createClass({
    contextTypes: {
    router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return ({
            songs: []
        })
    },
    componentDidMount: function () {
        SC.get('/users/' + this.props.routeParams.bandId + '/tracks').then(function(tracks){
            this.setState({
                songs: tracks
            });
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <h1>Upload from here band id {this.props.routeParams.bandId}</h1>
                <ul>
                    {this.state.songs.map(function (song) {
                        return <li>{song.title}</li>
                    })}
                </ul>
            </div>

        )
    }
});

module.exports = BandUpload;