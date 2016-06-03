var testServerConfig = 'localhost:3399';
var prodServerConfig = 'bob-poc.herokuapp.com';

var envConfig = process.env.NODE_ENV === "production" ? prodServerConfig : testServerConfig;

module.exports = envConfig;