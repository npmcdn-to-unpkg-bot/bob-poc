var devBackendPort = '3399';
var devFrontendPort = '8080';

var devServerConfig = 'localhost:';
var prodServerConfig = 'bob-poc.herokuapp.com';

var isProductionConf = process.env.NODE_ENV === "production";

module.exports = {
    frontEndConfig: isProductionConf ? prodServerConfig : devServerConfig + devFrontendPort,
    backEndConfig: isProductionConf ? prodServerConfig : devServerConfig + devBackendPort,
    soundCloudId: isProductionConf ? "8eacbc7c7a9abfa9a02ff93a2ff4cdfe" : "f372d41f0b8cd51c53240982350ab4fb"
};