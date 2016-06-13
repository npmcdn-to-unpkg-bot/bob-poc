var devBackendPort = '3399';
var devFrontendPort = '8080';

var devServerConfig = 'localhost:';
var prodServerConfig = 'bob-poc.herokuapp.com';

module.exports = {
    frontEndConfig: devServerConfig + devFrontendPort,
    backEndConfig: process.env.NODE_ENV === "production" ? prodServerConfig : devServerConfig + devBackendPort
};