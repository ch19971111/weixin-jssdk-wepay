const Router = require('koa-router')
const router = new Router()
const authController = require('../controllers/authController')
const jssdkController = require('../controllers/jssdkController')
const payController  = require('../controllers/payController')
const uploadImage    = require('../controllers/uploadImage')
 


router.get('jssdks',jssdkController)
router.get('auth',authController.auth)
router.post('auth',authController.reply)
router.get('pay',payController.pay)
router.post('wxpay',payController.wxpay)
router.post('upload',uploadImage)

module.exports = router