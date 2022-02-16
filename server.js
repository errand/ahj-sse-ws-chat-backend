/* eslint-disable no-fallthrough */
const ws = require('ws');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const PORT = process.env.PORT || 7070;

app.use(koaBody({
  text: true,
  urlencoded: true,
  json: true,
  multipart: true,
}));

// eslint-disable-next-line consistent-return
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set(
        'Access-Control-Allow-Headers',
        ctx.request.get('Access-Control-Allow-Request-Headers'),
      );
    }
    ctx.response.status = 204; // No content
  }
});

app.listen(PORT, () => console.log(`Koa server has been started on port ${PORT} ...`));

ws.binaryType = 'blob'; // arraybuffer
ws.addEventListener('open', () => {
  console.log('connected');
  // After this we can send messages
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('hello!');
  } else {
    // Reconnect
  }
});
ws.addEventListener('message', (evt) => {
// handle evt.data
  console.log(evt);
});
ws.addEventListener('close', (evt) => {
  console.log('connection closed', evt);
// After this we can't send messages
});
ws.addEventListener('error', () => {
  console.log('error');
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
const wsServer = new ws.Server({ server });
wsServer.on('connection', (ws, req) => {
  const errCallback = (err) => {
    if (err) {
      // TODO: handle error
    }
  };
  ws.on('message', msg => {
    console.log('msg');
    ws.send('response', errCallback);
  });
  ws.send('welcome', errCallback);
});
server.listen(port);
