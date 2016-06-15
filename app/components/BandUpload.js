var React = require('react');
var SC = require('soundcloud');
var Select = require('react-select');
var Loading = require('./Loading');
var MainWrapper = require('./MainWrapper');
var styles = require('../styles');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var serverConnector = require('../server/serverConnector');

var Submit = function (props) {
    var options = props.songs.filter(props.filterResults).map(function (song) {
        console.log(song);
        return {value: song.permalink, label: song.title};
    });

    var divStyle = {
        pointerEvents: props.songSubmitted ? "none" : null
    };

    return (
        <div className="jumbotron col-sm-6 col-sm-offset-3 text-center">
            <h2>Select a song from list</h2>
            <div className="col-sm-12" style={divStyle}>
                <form onSubmit={props.handleSubmit}>
                    <div className="form-group">
                        <Select
                            name="form-field-name"
                            value={props.selectValue}
                            options={options}
                            onChange={props.handleChange}
                            searchable={false}
                            clearable={false}
                        />
                    </div>
                    <div className="form-group col-sm-4 col-sm-offset-4">
                        <button
                            className="btn btn-block btn-success"
                            type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};

var BandUpload = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return ({
            songs: [],
            isLoading: true,
            selectValue: null,
            songSubmitted: false
        })
    },
    componentDidMount: function () {
        SC.get('/users/' + this.props.location.query.bandId + '/tracks').then(function (tracks) {
            console.log(tracks);
            this.setState({
                songs: tracks,
                isLoading: false,
                selectValue: null,
                songSubmitted: false
            });
        }.bind(this));
    },
    handleChange: function (val) {
        var currState = this.state;
        currState.selectValue = val.value;
        this.setState(currState);
    },
    sendSongToServer: function (e) {
        e.preventDefault();

        if (this.state.selectValue !== null) {
            SC.get('/me').then(function (band) {
                var streamUrl = band.permalink_url + "/" + this.state.selectValue;
                var bandName = band.username;
                var bandImage = band.avatar_url.replace(new RegExp('large.jpg$'), 't500x500.jpg');

                serverConnector.postSong(bandName, bandImage, streamUrl);

                var currState = this.state;
                currState.songSubmitted = true;
                this.setState(currState);
            }.bind(this));
        }
    },
    close: function () {
        var currState = this.state;
        currState.songSubmitted = false;
        this.setState(currState);

        this.context.router.push({ pathname: '/' });
    },
    filterResults: function (song) {
      return song.sharing !== "private"
    },
    render: function () {
        var mainDiv = this.state.isLoading ? <Loading /> : <Submit songSubmitted={this.state.songSubmitted}
                                                                   songs={this.state.songs}
                                                                   selectValue={this.state.selectValue}
                                                                   handleSubmit={this.sendSongToServer}
                                                                   handleChange={this.handleChange}
                                                                   filterResults = {this.filterResults} />;
        return (
            <div>
                {mainDiv}
                <Modal show={this.state.songSubmitted} onHide={this.close}>
                    <Modal.Body>
                        <h4>Song submitted successfully!</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
});

module.exports = BandUpload;