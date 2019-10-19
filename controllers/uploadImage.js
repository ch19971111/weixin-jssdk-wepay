const axios = require('axios')
const querystring = require('querystring')

const uploadImage = async function(ctx,next){
    let {access_token,media_id} = ctx.request.body
    console.log(access_token,'          ',media_id);
    let res = await axios({
        url: 'http://file.api.weixin.qq.com/cgi-bin/media/get',
        params: {
            access_token,
            media_id
        }
    })
    let data = (new Buffer(res.data)).toString('base64')
    console.log(data);

    ctx.body = 'ok'
}

module.exports = uploadImage