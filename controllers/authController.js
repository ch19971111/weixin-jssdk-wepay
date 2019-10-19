const tools = require('../utils/tools')
const config = require('../config/')
const getRawBody = require('raw-body')
const contentType = require('content-type')
const convert = require('xml-js')
const auth = (ctx,next)=>{
    let {signature,echostr,timestamp,nonce} = ctx.query
    let orderedQueryString = [config.token,timestamp,nonce].sort().join('')
    let mySignature = tools.sha1(orderedQueryString)
    ctx.body = mySignature === signature ?  echostr : ''
}

const reply = async (ctx,next)=>{
   let receiveMsgXML = (await getRawBody(ctx.req,{
    length: ctx.req.headers['content-length'],
    limit: '1mb',
    encoding: contentType.parse(ctx.req).parameters.charset
   })).toString()
   let receiveMsgJs = convert.xml2js(receiveMsgXML,{
    compact: true,
    cdataKey: 'value',
    textKey: 'value'
   }).xml

   let {ToUserName,FromUserName} = tools.flatObj(receiveMsgJs)
   await ctx.render('reply',{
     ToUserName,
     FromUserName,
     timestamp:1234,
     Content:'<a href="https://luckych.club">惊喜</a>'
   })
}


module.exports = {
    auth,
    reply
}