const tools = require('../utils/tools')
const querystring  = require('querystring')
const crypto = require('crypto')
const axios = require('axios')
const convert = require('xml-js')
const getRawBody = require('raw-body')
const contentType = require('content-type')

const QRCode  = require('qrcode')


const  getSign = (options,key)=>{
    let orderQuery = Object.keys(options).sort().reduce((prev,item)=>{
        prev[item] = options[item]
        return prev
    },{})

    let queryStr = querystring.unescape(querystring.stringify(orderQuery))
    let stringSignTemp = queryStr + `&key=${key}`

    const stringA =  crypto.createHash('MD5').update(stringSignTemp).digest('hex')

    return stringA.toUpperCase()
}

const pay = async (ctx,next)=>{
    let appid = 'wx100749d4612ea385'
    let mch_id = '1448624302'
    let nonce_str = tools.randomStr() // 随机字符串
    let body = '测试支付CH'   // 订单信息
    let out_trade_no = new Date().getTime() // 订单编号
    let total_fee	= 1
    let spbill_create_ip = '123.12.12.123'
    let notify_url = 'https://luckych.club/wxpay'
    let trade_type = 'NATIVE'

    let key = 'T8NHKqOfKWtqZPnQm8K77PtQtaRXluU8'

    let options = {
        appid,
        mch_id,
        nonce_str,
        body,
        out_trade_no,
        total_fee,
        spbill_create_ip,
        notify_url,
        trade_type
    }
    let sign = getSign(options,key)
    sentSign = sign
    let xml = convert.js2xml({
        xml: {
          ...options,
          sign
        }
      }, {
        compact: true
    })
     let result = ( await axios({
        url : 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        method:"POST",
        data:xml
    })).data

    let resultObj = convert.xml2js(result,{
        compact: true,
        textKey: 'value',
        cdataKey: 'value'
    }).xml

    let code_url = Object.keys(resultObj).reduce((prev,item)=>{
        prev[item] = resultObj[item].value
        return prev
    },{}).code_url

    const imagefunc =  ()=>{
        return new Promise((rej,rev)=>{
            QRCode.toDataURL(code_url,(err,url)=>{
                rej(url) 
            })
        })
    }

    const image = await imagefunc()
    
    ctx.set("Content-Type", "application/json")
    ctx.body = JSON.stringify(
        {
            image,
            orderNumber: out_trade_no
        })

}

const wxpay = async (ctx,next)=>{

    let key = 'T8NHKqOfKWtqZPnQm8K77PtQtaRXluU8'
    let strXML = (await getRawBody(ctx.req,{
        length: ctx.req.headers['content-length'],
        limit: '1mb',
        encoding: contentType.parse(ctx.req).parameters.charset
       })).toString()
    let strJS = convert.xml2js(strXML,{
        compact: true,
        textKey: 'value',
        cdataKey: 'value'
    }).xml

    let strA = Object.keys(strJS).reduce((prev,item)=>{
        prev[item] = strJS[item].value
        return prev
    },{})

    let backSign = strA.sign

    delete strA.sign
    let sign = getSign(strA,key)

    if(sign === backSign){
        console.log(1);
        ctx.body = `
        <xml>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <return_msg><![CDATA[OK]]></return_msg>
        </xml>
        `
    } 
}


module.exports = {
    pay,
    wxpay
}