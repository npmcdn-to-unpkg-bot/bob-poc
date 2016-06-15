var axios = require('axios');
var serverConfig = require('../config/server').backEndConfig;

var helpers = {
    getBattleInfo: function () {
        return axios.get('http://' + serverConfig + '/v1/current-match').catch(function (err) {
            console.warn('Error in getBattleInfo', err);
        })
    },
    reportVote: function (bandId) {
        axios.post('http://' + serverConfig + '/v1/vote', {
            id: bandId
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (err) {
            console.warn('Error posting vote', err);
        });
    },
    postSong: function (bandName, bandImage, streamUrl) {
        console.log(bandName);
        console.log(bandImage);
        console.log(streamUrl);

        axios.post('http://' + serverConfig + '/v1/song', {
            name: bandName,
            img: bandImage,
            url: streamUrl
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (err) {
            console.warn('Error posting song', err);
        });
    }
};

module.exports = helpers;