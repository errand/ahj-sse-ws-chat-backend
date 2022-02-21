/* eslint-disable no-fallthrough */
const WS = require('ws');
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const PORT = process.env.PORT || 7070;

const Chat = require('./src/Chat');

const ctrl = new Chat();

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
    // eslint-disable-next-line no-return-await
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

app.use(async (ctx) => {
  const { method, id } = ctx.request.query;
  // console.log(ctx.request.query);
  switch (method) {
    case 'getAllUsers':
      try {
        const result = ctrl.getAllUsers();
        ctx.response.body = result;
        console.log(ctx.response.body);
      } catch (err) {
        console.error(err);
      }
      return;
    case 'getAllPosts':
      try {
        const result = ctrl.getAllPosts();
        ctx.response.body = result;
        console.log(ctx.response.body);
      } catch (err) {
        console.error(err);
      }
      return;
    case 'allMessages':
      try {
        const result = ctrl.allMessages();
        ctx.response.body = result;
      } catch (err) {
        console.error(err);
      }
      return;
    case 'createUser':
      try {
        const object = ctx.request.body;
        const result = ctrl.createUser(object);
        ctx.response.body = result;
      } catch (err) {
        console.error(err);
      }
      return;
    case 'createPost':
      try {
        const object = ctx.request.body;
        const result = ctrl.createPost(object);
        ctx.response.body = result;
      } catch (err) {
        console.error(err);
      }
      return;

    default:
      ctx.response.body = `Method "${method}" is not known.`;
      ctx.response.status = 404;
  }
});

const server = http.createServer(app.callback());

const wsServer = new WS.Server({ server });

wsServer.on('connection', (ws, req) => {
  console.log('connection');

  const clients = ctrl.getAllUsers();

  [...wsServer.clients]
    .filter((o) => o.readyState === WS.OPEN)
    .forEach((o) => o.send(JSON.stringify({ type: 'connect', user: clients[clients.length - 1] })));

  ws.on('message', (msg) => {
    const post = JSON.parse(msg);
    [...wsServer.clients]
      .filter((o) => o.readyState === WS.OPEN)
      .forEach((o) => o.send(JSON.stringify(post)));
  });
  ws.on('close', (msg) => {
    const userID = JSON.parse(msg);
    [...wsServer.clients]
      .filter((o) => o.readyState === WS.OPEN)
      .forEach((o) => o.send(JSON.stringify(clients)));
    ws.close(1000, 'disconnect');
  });
});

server.listen(PORT, () => console.log(`Koa server has been started on port ${PORT} ...`));
