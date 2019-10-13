const tools = require('../utils/tools')
const {appid,appsecret,url}   = require('../config/')
const querystring  = require('querystring')

module.exports = async (ctx,next)=>{
    let {access_token} = await tools.http({
        url:`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`
    })
    
    let {ticket} = await tools.http({
        url:`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
    })
  
    let noncestr = tools.randomStr()
    let timestamp = tools.genTimeStamp()
    let query = {
        noncestr,
        jsapi_ticket:ticket,
        timestamp,
        url
    }

    let orderQuery = Object.keys(query).sort().reduce((prev,item)=>{
        prev[item] = query[item]
        return prev
    },{})
    let string1 = querystring.unescape(querystring.stringify(orderQuery))
    let signature = tools.sha1(string1)
    ctx.body = {
        appId: appid,
        timestamp,
        nonceStr: noncestr,
        signature
    }
}



