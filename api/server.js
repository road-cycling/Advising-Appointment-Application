const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());


const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
const http = require('http');
const API_PORT = 8239;

require('./config/routes.js')(app);

const httpsServer = http.createServer(app.callback());
httpsServer.listen(API_PORT, () => console.log(`Listening on HTTPS port ${API_PORT}`));

