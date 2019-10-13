const koa = require('koa')
const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')
const views  = require('koa-views')
const path   = require('path')
const static = require('koa-static')

const auth = require('./routes/auth')


const  app = new koa()
const router = new Router()


// 解析post请求
app.use(bodyparser())
// 加载模板引擎
app.use(views(path.join(__dirname,'./views'),{
    extension: 'ejs'
}))

// 静态资源目录
app.use(static(
    path.join(__dirname,'./public')
))

router.use('/',auth.routes())
app.use(router.routes())



app.listen(3333,()=>{
    console.log('localhost:3333')
})
