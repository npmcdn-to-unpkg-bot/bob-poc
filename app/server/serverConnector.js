var axios = require('axios');

var helpers = {
    getBattleInfo: function () {
        return axios.get('http://localhost:3399/v1/match').catch(function (err) {
            console.warn('Error in getBattleInfo', err);
        })
    }
};

module.exports = helpers;