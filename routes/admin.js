var express = require('express');
var router = express.Router();
/*CONTROLLER*/
const controllerAdmin = require('../controller/controllerAdmin.js');
/*MODAL*/
const modalAdmin = require('../schema/AdminSetup.js');

/* CREATE. */
router.post('/create', function(req, res, next) {
	
		let timeOption = req.body.time_option.toString();

		let arrTimeOption  = timeOption.split(";");

		let quantityVipEye = req.body.quantity_vip_eye.toString();

		let arrquantityVipEye  = quantityVipEye.split(";");

		let quantityScanCmt = req.body.quantity_scan_cmt.toString();

		let arrquantityScanCmt  = quantityScanCmt.split(";");

 		let arr = [
 			{
 				name              : 'VIP1',
 				limit_post        : 10,
 				price_pay_buy     : 10000,
 				price_pay_cmt     : 10,
 			},
 			{
 				name              : 'VIP2',
 				limit_post        : 20,
 				price_pay_buy     : 20000,
 				price_pay_cmt     : 9,
 			},
 			{
 				name              : 'VIP3',
 				limit_post        : 30,
 				price_pay_buy     : 30000,
 				price_pay_cmt     : 8,
 			},
 		]
		let data = { 
			price_one_eye               :		req.body.price_one_eye ,
			view_max                    :		req.body.view_max ,
			price_comment_randum        :		req.body.price_comment_randum ,
			price_comment_choose        :		req.body.price_comment_choose ,
			comment_max                 :		req.body.comment_max ,
			price_like                  :		req.body.price_like ,
			like_max                    :		req.body.like_max ,
			time_option                 :       arrTimeOption , 
			quantity_vip_eye            :       arrquantityVipEye , 
			price_vip_eye               :		req.body.price_vip_eye ,
			price_scan_cmt              :		req.body.price_scan_cmt ,
			quantity_scan_cmt           :		arrquantityScanCmt ,
			time_create     			: 		new Date().getTime() ,
			time_update     			: 		req.body.time_update ,
			list_combo_scan_cmt         : 	    arr
		}
		controllerAdmin.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else { 
				return res.json( {code : 200 , data : api } );
			}
		})
});

/* GET */

router.get('/list', function(req, res, next) {
		controllerAdmin.getListSetup(  function ( err , list){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else{
						return res.json( {code : 200 , data : list } );
			}
		})
});

router.delete('/delete/:id', function(req, res, next) {
		let id_AdSetup = parseInt(req.params.id);
		controllerAdmin.handleDelete(  id_AdSetup , function ( err , list){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else{
						return res.json( {code : 200 , data : list } );
			}
		})
});



module.exports = router;
