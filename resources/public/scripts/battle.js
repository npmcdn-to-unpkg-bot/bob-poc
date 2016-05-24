var VoteForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var bandId = this.props.bandId;
        this.props.onVoteSubmit({bandId: bandId});
    },
    render: function() {
        return (
            <form className="voteForm" onSubmit={this.handleSubmit}>
                <input type="submit" value="VOTE!" disabled={!this.props.active} />
            </form>
        );
    }
});

var Band = React.createClass({
    handleVoteSubmit: function(band) {
        var newState = this.state;
        newState.votes = newState.votes + 1;
        this.setState(newState);
        console.log(newState);

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
    componentWillReceiveProps: function(newProps) {
        this.setState(newProps.data);
    },
    render: function() {
        return (
            <div className="band">
                <h2 className="bandName">
                    {this.state.name} (Votes {this.state.votes})
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
                <VoteForm bandId={this.state.id} onVoteSubmit={this.handleVoteSubmit} active={this.props.active} />
            </div>
        );
    }
});

var BandList = React.createClass({
    render: function() {
        console.log(this.props.data);
        var propsData = this.props.data.standoff;
        var matchNumber = this.props.data.match;
        var isActive = this.props.active;

        if (propsData != null) {
            var bandNodes = propsData.map(function(band) {
                return (
                    <Band data={band} key={matchNumber + "-" + band.id} active={isActive}>
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

// Generic Countdown Timer UI component
//
// https://github.com/uken/react-countdown-timer
//
// props:
//   - initialTimeRemaining: Number
//       The time remaining for the countdown (in ms).
//
//   - interval: Number (optional -- default: 1000ms)
//       The time between timer ticks (in ms).
//
//   - formatFunc(timeRemaining): Function (optional)
//       A function that formats the timeRemaining.
//
//   - tickCallback(timeRemaining): Function (optional)
//       A function to call each tick.
//
//   - completeCallback(): Function (optional)
//       A function to call when the countdown completes.
//
var CountdownTimer = React.createClass({
    displayName: 'CountdownTimer',

    propTypes: {
        initialTimeRemaining: React.PropTypes.number.isRequired,
        interval: React.PropTypes.number,
        formatFunc: React.PropTypes.func,
        tickCallback: React.PropTypes.func,
        completeCallback: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            interval: 1000,
            formatFunc: null,
            tickCallback: null,
            completeCallback: null
        };
    },

    getInitialState: function() {
        // Normally an anti-pattern to use this.props in getInitialState,
        // but these are all initializations (not an anti-pattern).
        return {
            timeRemaining: this.props.initialTimeRemaining,
            timeoutId: null,
            prevTime: null
        };
    },

    componentDidMount: function() {
        this.tick();
    },

    componentWillReceiveProps: function(newProps) {
        if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
        this.setState({prevTime: null, timeRemaining: newProps.initialTimeRemaining});
    },

    componentDidUpdate: function() {
        if ((!this.state.prevTime) && this.state.timeRemaining > 0 && this.isMounted()) {
            this.tick();
        }
    },

    componentWillUnmount: function() {
        clearTimeout(this.state.timeoutId);
    },

    tick: function() {
        var currentTime = Date.now();
        var dt = this.state.prevTime ? (currentTime - this.state.prevTime) : 0;
        var interval = this.props.interval;

        // correct for small variations in actual timeout time
        var timeRemainingInInterval = (interval - (dt % interval));
        var timeout = timeRemainingInInterval;

        if (timeRemainingInInterval < (interval / 2.0)) {
            timeout += interval;
        }

        var timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
        var countdownComplete = (this.state.prevTime && timeRemaining <= 0);

        if (this.isMounted()) {
            if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }
            this.setState({
                timeoutId: countdownComplete ? null : setTimeout(this.tick, timeout),
                prevTime: currentTime,
                timeRemaining: timeRemaining
            });
        }

        if (countdownComplete) {
            if (this.props.completeCallback) { this.props.completeCallback(); }
            return;
        }

        if (this.props.tickCallback) {
            this.props.tickCallback(timeRemaining);
        }
    },

    getFormattedTime: function(milliseconds) {
        if (this.props.formatFunc) {
            return this.props.formatFunc(milliseconds);
        }

        var totalSeconds = Math.round(milliseconds / 1000);

        var seconds = parseInt(totalSeconds % 60, 10);
        var minutes = parseInt(totalSeconds / 60, 10) % 60;
        var hours = parseInt(totalSeconds / 3600, 10);

        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        hours = hours < 10 ? '0' + hours : hours;

        return hours + ':' + minutes + ':' + seconds;
    },

    render: function() {
        var timeRemaining = this.state.timeRemaining;

        return (
            <div className='timer'>
                {this.getFormattedTime(timeRemaining)}
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
                console.log(data);
                this.setState({data: data, active: (data.time > 0)});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: {standoff: [], match: 0, time: 0}, active: false};
    },
    componentDidMount: function() {
        this.loadMatchFromServer();
        setInterval(this.loadMatchFromServer, this.props.pollInterval);
    },
    inactiveVoting: function() {
        var newState = this.state;
        newState.active = false;
        this.setState(newState);
    },
    render: function() {
        return (
            <div className="bandBox">
                <CountdownTimer initialTimeRemaining={this.state.data.time} completeCallback={this.inactiveVoting} />
                <h1>Bands - Round {this.state.data.match}</h1>
                <BandList data={this.state.data} active={this.state.active}/>
            </div>
        );
    }
});

ReactDOM.render(
    <StandoffBox url="/v1/match" pollInterval={2000} />,
    document.getElementById('content')
);
