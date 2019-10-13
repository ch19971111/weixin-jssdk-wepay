const crypto = require('crypto')
const axios  = require('axios')
const randomString = require('randomstring')
const sha1 = (str)=>{
    return crypto.createHash('sha1').update(str).digest('hex')
    // ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
}

const flatObj = (obj)=>{
    return Object.keys(obj).reduce((prev,item)=>{
         prev[item] = obj[item].value
         return  prev
    },{})
}

const http = ({url}) =>{
    return axios({url})
        .then((result)=>{
            return result.data
        })
}

const genTimeStamp = ()=>{
    return Math.ceil((new Date().getTime())/1000)
}

const randomStr  = ()=>{
    return randomString.generate(32)    
}

module.exports = {
    sha1,
    flatObj,
    http,
    genTimeStamp,
    randomStr
}