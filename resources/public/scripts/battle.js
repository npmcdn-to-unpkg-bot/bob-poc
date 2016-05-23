/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var VoteForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var bandId = this.props.bandId;
        this.props.onVoteSubmit({bandId: bandId});
    },
    render: function() {
        return (
            <form className="voteForm" onSubmit={this.handleSubmit}>
                <input type="submit" value="VOTE!" />
            </form>
        );
    }
});

var Band = React.createClass({
    handleVoteSubmit: function(band) {
        console.log(this.state);
        $.ajax({
            url: '/v1/vote',
            dataType: 'json',
            type: 'POST',
            data: band,
            success: function(data) {
                this.setState(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/v1/vote', status, err.toString());
            }.bind(this)
        });
    },
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
    },
    getInitialState: function() {
        return this.props.data;
    },
    render: function() {
        return (
            <div className="band">
                <h2 className="bandName">
                    {this.state.name} (Votes {this.state.votes})
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
                <VoteForm bandId={this.state.id} onVoteSubmit={this.handleVoteSubmit} />
            </div>
        );
    }
});

var StandoffBox = React.createClass({
    loadMatchFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadMatchFromServer();
        setInterval(this.loadMatchFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="bandBox">
                <h1>Bands</h1>
                <BandList data={this.state.data} />
            </div>
        );
    }
});

var BandList = React.createClass({
    render: function() {
        var propsData = this.props.data.standoff;
        console.log(propsData)

        if (propsData != null) {
            var bandNodes = propsData.map(function(band) {
                return (
                    <Band data={band}>
                        {band.facebook}
                    </Band>
                );
            });
            return (
                <div className="bandList">
                    {bandNodes}
                </div>
            );
        } else {
            return null;
        }
    }
});

ReactDOM.render(
    <StandoffBox url="/v1/match" pollInterval={2000} />,
    document.getElementById('content')
);
