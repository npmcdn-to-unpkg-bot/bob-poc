var axios = require('axios');

var helpers = {
    getBattleInfo: function () {
        return axios.get('http://bob-poc.herokuapp.com/v1/current-match').catch(function (err) {
            console.warn('Error in getBattleInfo', err);
        })
    },
    reportVote: function (bandId) {
        axios.post('http://bob-poc.herokuapp.com/v1/vote', {
            id: bandId
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (err) {
            console.warn('Error posting vote', err);
        });
    }
};

module.exports = helpers;