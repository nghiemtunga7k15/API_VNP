var express = require('express');
var router = express.Router();
var moment = require('moment');
var fs = require('fs');

/*CONTROLLER*/
const controllerScanComment = require('../../controller/ST/controllerScanComment.js');
const controllerAdmin = require('../../controller/controllerAdmin.js');

/*MODAL*/
const modalScanComment = require('../../schema/ScanComment.js');

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
				return combo.name == req.body.type_order.toString().toUpperCase() ;
			});
				
			data.type_order =  {
				name          : combo_matching[0].name,
				limit_post    : combo_matching[0].limit_post,
				price_pay_buy : combo_matching[0].price_pay_buy,
				price_pay_cmt : combo_matching[0].price_pay_cmt,
			}	
		}

		controllerScanComment.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else { 
				var writeStream = fs.createWriteStream(`public/file/${req.body.fb_id}.txt`);
				var header="STT" + " UserID "+ "\t" +  "\t" +"FacebookName" +"\t"  +"\t" +"Giới tính" + "\t" +"SDT" + "\t" +"\t" +"Email" + "\t" +"\t" +"Địa chỉ"+ "\t" +"\t"  +"Nội dung Comment" + "\t" +"\t"  +"Thời gian Comment" +  "\n";
				writeStream.write(header);

				return res.json( {code : 200 , data : api } );
			}
		})
	})
	.catch(e=>{
			return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
	})
});
router.get('/list', function(req, res, next) {
		let _limit = parseInt(req.query.limit);
		let page = parseInt(req.query.page);
		if (!_limit || _limit == null) {
			_limit = 20;
		}
		if (!page || page == null) {
			page = 1;
		}
		controllerScanComment.getListOrder( _limit , page ,  function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				modalScanComment.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : [] } );
   					} else {
						return res.json( {code : 200 , data : listBuffEye ,  page : page , limit : _limit , total : totalRecord } );
   					}
				})

			}
		})
});


router.get('/detail/:id', function(req, res, next) {
		let idScanCmt = parseInt(req.params.id);
		controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailOrderScanCmt){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {
				return res.json( {code : 200 , data : detailOrderScanCmt } );
			}
		})
});

router.put('/update-status/:id', function(req, res, next) {
		let idScanCmt = parseInt(req.params.id);
		let promise  =  controllerAdmin.getAdminSetup();
		promise.then(success=>{
			let price = parseInt(success[0].price_scan_cmt);
			let data = req.body;
			
			data.time_update = new Date().getTime();

			controllerScanComment.handleUpdateScanCmt( idScanCmt , req.body ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : [] } );
				} else {
					controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailBuffVipEye){	
						return res.json( {code : 200 , data : detailBuffVipEye } );
					})
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
		})
});

router.delete('/delete/:id', function(req, res, next) {
		let idScanCmt = parseInt(req.params.id);
		controllerScanComment.handleDelete( idScanCmt ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let fb_id = req.params.id.toString();
		let promise  = controllerScanComment.getDetailScanCmtPromise(fb_id)
		var writeStream = fs.createWriteStream(`public/file/${fb_id}.txt`);
		var header="STT" + " UserID "+ "\t" +  "\t" +"FacebookName" +"\t"  +"\t" +"Giới tính" + "\t" +"SDT" + "\t" +"\t" +"Email" + "\t" +"\t" +"Địa chỉ"+ "\t" +"\t"  +"Nội dung Comment" + "\t" +"\t"  +"Thời gian Comment" +  "\n";
		writeStream.write(header , {encoding: 'utf8'});
		let data  = {}
		let arrContent = [];
		let jsonData = JSON.stringify(req.body);
		let arrData = JSON.parse(jsonData);
		data.time_update = new Date().getTime() ;
		promise.then(obj=>{
			if ( Array.isArray(arrData) ==  true &&  Array.isArray(obj.content) ==  true ) {
				arrContent = obj.content.concat(arrData);
				data.content      = arrContent ;
			}else { 
				arrContent = arrData;
				data.content      = arrContent ;
			}
			controllerScanComment.handleUpdateByFaceId( fb_id  , data  ,function ( err , updateSuccess){
					if(err)  {
						return res.json( {code : 404 , data : [] } );
					} else {
						let num = 1;
						let msg = 'msg';
						if  ( Array.isArray(arrContent) ==  true ) {
							arrContent.forEach(comment=>{
								let time = comment.created_time.toString().replace('T01:50:28+0000' , ' ')
								let row = `${num}  ${comment.user_id}  \t  ${comment.user_name}  \t \t  ${msg} \t \t${msg}  \t \t   ${msg}   \t ${msg}   \t  \t  ${comment.message}  \t  \t \t   ${time}   \n`;
								writeStream.write(row , {encoding: 'utf8'});
								num = num +1;
							})
						}
						return res.json( {code : 200 , data : { msg: 'Thành Công' } } );
					}
			})

		})
});

router.get('/detail-order', function(req, res, next) {
		let query  = { status : 0 } ;  
		let update = { status : 1 } ;  
		modalScanComment.findOneAndUpdate( query , update , { upsert:false }, function(err, detailBuffCmt){
		 			if  ( detailBuffCmt ) {
		 				if (err) {
		 					return res.json( {code : 404 , data : [] } );	
			 			} else {
			 				return res.json( {code : 200 , data : { post_id : detailBuffCmt.fb_id } } );
			 			}
		 			} else {
		 					return res.json( {code : 404 , data : { msg : 'Order Not Found' } } );	
		 			}
		}); 

});
module.exports = router;