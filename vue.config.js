var fs = require('fs');
module.exports = {
  //...
  devServer: {
    https: true,
    host: process.env.VUE_APP_URL_HOST,
    port: process.env.VUE_APP_URL_PORT,
    key: fs.readFileSync(process.env.VUE_APP_SSL_KEY),
    cert: fs.readFileSync(process.env.VUE_APP_SSL_CRT),
    ca: fs.readFileSync(process.env.VUE_APP_SSL_PEM),
  }
};