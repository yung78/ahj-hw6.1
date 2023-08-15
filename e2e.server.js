// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const server = new WebpackDevServer(webpack(config), {});
server.listen(9000, 'localhost', (err) => {
  if (err) {
    return;
  }
  if (process.send) {
    process.send('ok');
  }
});
