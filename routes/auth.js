const Router = require('koa-router')
const router = new Router()
const authController = require('../controllers/authController')
const jssdkController = require('../controllers/jssdkController')
const payController  = require('../controllers/payController')
// console.log(jssdkController);



router.get('jssdks',jssdkController)
router.get('auth',authController.auth)
router.post('auth',authController.reply)
router.get('pay',payController.pay)
router.post('wxpay',payController.wxpay)

module.exports = router