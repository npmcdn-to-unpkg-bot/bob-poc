var React = require('react');
var SC = require('soundcloud');
var Select = require('react-select');
var Loading = require('./Loading');
var MainWrapper = require('./MainWrapper');
var styles = require('../styles');

var BandUpload = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return ({
            songs: [],
            isLoading: true,
            selectValue: null
        })
    },
    componentDidMount: function () {
        SC.get('/users/' + this.props.routeParams.bandId + '/tracks').then(function (tracks) {
            this.setState({
                songs: tracks,
                isLoading: false,
                selectValue: null
            });
        }.bind(this));
    },
    handleChange: function (val) {
        var currState = this.state;
        currState.selectValue = val.value;
        this.setState(currState);
    },
    render: function () {
        var options = this.state.songs.map(function (song) {
            return {value: song.id, label: song.title};
        });

        return (
            this.state.isLoading ? <Loading /> : <MainWrapper>
                <h2>Select a song from list</h2>
                <div className='col-sm-8 col-sm-offset-2'>
                    <Select
                        name="form-field-name"
                        value={this.state.selectValue}
                        options={options}
                        onChange={this.handleChange}
                        searchable={false}
                        clearable={false}
                    />
                </div>
                <div className='col-sm-8 col-sm-offset-2'><button type="button" className="btn btn-sm btn-success">Upload</button></div>
            </MainWrapper>

        )
    }
});

module.exports = BandUpload;