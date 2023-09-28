const router = require('koa-router')()
const { formidable } = require('formidable')
const busBody = require('async-busboy')
router.prefix('/upload')

router.post('/', async function (ctx, next) {
  // const form = formidable({});
  // const [fields, files] = await form.parse(ctx.request);
  console.log('-----------------');
  const {files, fields} = await busBody(ctx.req);
  console.log(fields);
  console.log(files);
  ctx.body = 'success'
  next()
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
