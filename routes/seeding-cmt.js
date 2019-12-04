var express = require('express');
var router = express.Router();
var moment = require('moment');
var fs = require('fs');

/*CONTROLLER*/
const controllerSeedingComment = require('../controller/controllerSeedingComment.js');
const controllerAdmin = require('../controller/controllerAdmin.js');

/*MODAL*/
const modalScanComment = require('../schema/ScanComment.js');

router.post('/create', function(req, res, next) {
	let promise  =  controllerAdmin.getAdminSetup();
	promise.then(success=>{
		let timeOneDay  = 60 * 60 * 24 * 1000;
		let minutesOnDay = 60 * 24;
		let data = { 
			fb_id              : 		req.body.fb_id 	,
			minutes            :        (parseInt(req.body.time) *minutesOnDay).toString(),
			time_create        :		new Date().getTime(),
			time_expired       :        new Date().getTime() + parseInt(req.body.time) * timeOneDay
		}

		let list_combo = success[0].list_combo_scan_cmt;
		// Matching Combo
		if (list_combo.length > 0 ) {
			combo_matching = list_combo.filter(function (combo) {
				return combo.name == req.body.type_order.toString() ;
			});
				
			data.type_order =  {
				name          : combo_matching[0].name,
				limit_post    : combo_matching[0].limit_post,
				price_pay_buy : combo_matching[0].price_pay_buy,
				price_pay_cmt : combo_matching[0].price_pay_cmt,
			}	
		}

		SeedingComment.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else { 
				var writeStream = fs.createWriteStream(`public/file/${req.body.fb_id}.xls`);
				var header="STT" + "\t" + " UserID "+ "\t" +"FacebookName" +"\t" +"Giới tính" + "\t" +"SDT" + "\t" +"\t" +"Email" +"\t" +"Địa chỉ" +"\t" +"Nội dung Comment" +"\t" +"Thời gian Comment" +  "\n";
				writeStream.write(header);

				return res.json( {code : 200 , data : api } );
			}
		})
	})
	.catch(e=>{
			return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
	})
});

// router.get('/list', function(req, res, next) {
// 		let _limit = parseInt(req.query.limit);
// 		let page = parseInt(req.query.page);
// 		if (!_limit || _limit == null) {
// 			_limit = 20;
// 		}
// 		if (!page || page == null) {
// 			page = 1;
// 		}
// 		controllerScanComment.getListOrder( _limit , page ,  function ( err , listBuffEye){
// 			if(err) {
// 				return res.json( {code : 404 , data : [] } );
// 			} else {
// 				modalScanComment.count({}, function( err, totalRecord){
//    					if ( err ) {
//    						return res.json( {code : 404 , data : [] } );
//    					} else {
// 						return res.json( {code : 200 , data : listBuffEye ,  page : page , limit : _limit , total : totalRecord } );
//    					}
// 				})

// 			}
// 		})
// });


// router.get('/detail/:id', function(req, res, next) {
// 		let idScanCmt = parseInt(req.params.id);
// 		controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailOrderScanCmt){
// 			if(err)  {
// 				return res.json( {code : 404 , data : [] } );
// 			} else {
// 				return res.json( {code : 200 , data : detailOrderScanCmt } );
// 			}
// 		})
// });


// router.delete('/delete/:id', function(req, res, next) {
// 		let idScanCmt = parseInt(req.params.id);
// 		controllerScanComment.handleDelete( idScanCmt ,function ( err , updateSuccess){
// 			if(err)  {
// 				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
// 			} else {
// 				return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
// 			}
// 		})
// });



module.exports = router;
