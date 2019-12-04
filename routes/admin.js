var express = require('express');
var router = express.Router();
var fs = require('fs');

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

		// let quantityScanCmt = req.body.quantity_scan_cmt.toString();

		// let arrquantityScanCmt  = quantityScanCmt.split(";");

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
			list_combo_scan_cmt         : 	    arr,
			// price_scan_cmt              :		req.body.price_scan_cmt ,
			// quantity_scan_cmt           :		arrquantityScanCmt ,
			price_seeding_cmt           :       req.body.price_seeding_cmt,
			time_create     			: 		new Date().getTime() ,
			time_update     			: 		req.body.time_update ,
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
// router.get('/create-file', function(req, res, next) {
// 		var writeStream = fs.createWriteStream("public/file/file.xls");
// 		var header="STT" + "\t" + " UserID "+ "\t" +"FacebookName" +"\t" +"Giới tính" + "\t" +"SDT" + "\t" +"\t" +"Email" +"\t" +"Địa chỉ" +"\t" +"Nội dung Comment" +"\t" +"Thời gian Comment" +  "\n";
// 		let arr = [
// 				{
// 					"comment_id": "1119515925047193",
// 					"created_time": "2019-12-03T01:50:28+0000",
// 					"user_name": "Tr?n Phan T?n",
// 					"user_id": "100002933922521",
// 					"message": "Mình luôn kéo t? du?i lên d? có d?ng l?c ^^",
// 					"like_count": "0",
// 					"is_post": true
// 				},
// 				{
// 					"comment_id": "1119515081713944",
// 					"created_time": "2019-12-03T01:48:48+0000",
// 					"user_name": "Ph?m Van Long",
// 					"user_id": "100003485657336",
// 					"message": "mai chuyên co c?a bà nguy?n th? kim ngân s? ch? m?y ngu?i sang tr?n ? l?i dây",
// 					"like_count": "0",
// 					"is_post": true
// 				},
// 				{
// 					"comment_id": "1119484221717030",
// 					"created_time": "2019-12-03T00:55:32+0000",
// 					"user_name": "Ng?c Anh",
// 					"user_id": "100004285771885",
// 					"message": "Ui... x?n quá ?",
// 					"like_count": "0",
// 					"is_post": true
// 				},
// 				{
// 					"comment_id": "1119482318383887",
// 					"created_time": "2019-12-03T00:52:41+0000",
// 					"user_name": "Ngô Kim Ngân",
// 					"user_id": "100009812643937",
// 					"message": "",
// 					"like_count": "0",
// 					"is_post": true
// 				}
// 		]
	
// 		writeStream.write(header);
// 		let num  = 1;
// 		arr.forEach(obj=>{
// 			let name = obj.user_name
// 			// let row = `${num}`+"\t"+" 21"+"\t"+"Rob"+"\n";
// 			let row = `${num} \t ${obj.user_id} \t ${obj.user_name} \t ${obj.message}  \n`;
// 			writeStream.write(row);
// 			num = num +1;
// 		})

// 		writeStream.close();
// });


module.exports = router;
