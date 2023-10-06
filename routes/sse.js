const { Transform } = require('stream')
const router = require('koa-router')()
router.prefix('/sse')

// 创建转换流
const tableTransform = new Transform({
  objectMode: true,
  transform(message, encoding, callback) {
    let data = message.type ? `event: ${message.type}\n` : '';
    data += message.id ? `id: ${message.id}\n` : '';
    data += message.retry ? `retry: ${message.retry}\n` : '';
    data += message.data ? toDataString(message.data) : '';
    data += '\n';
    this.push(data);
    callback();
  }
})
tableTransform.on('error', (err) => {
  console.log(err);
})
const isObject = (fn) =>
  typeof fn === 'object';

// 将 JSON 解析为 SSE 报文
function toDataString(data) {
  if (isObject(data)) {
    return toDataString(JSON.stringify(data));
  }

  return data
    .split(/\r\n|\r|\n/)
    .map(line => `data: ${line}\n`)
    .join('');
}

router.all('/:tableId/sse', (ctx, next) => {
  // 打印日志，判断 api 是否被调用
  console.log(ctx.method, ctx.req.url, new Date().toLocaleString())
  // ctx.res.writeHead(200, {
  //   'Content-Type': 'text/event-stream',
  //   Connection: 'keep-alive',
  //   'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
  // });
  ctx.set('Content-Type', 'text/event-stream');
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Connection', 'keep-alive');
  // ctx.body = tableTransform.pipe(ctx.res)
  // tableTransform.pipe(ctx.res)
  ctx.body = tableTransform
})
router.post('/addCart/:tableId', (ctx) => {
  console.log(ctx.request.body);
  tableTransform.write({
    retry: 10000,
    data: {name: 'XXXXXXXXXXXx'}
  })
  ctx.body = 'success'
})
module.exports = router
