var express = require('express');
var router = express.Router();
var moment = require('moment');

/*CONTROLLER*/
const controllerScanComment = require('../controller/controllerScanComment.js');
const controllerAdmin = require('../controller/controllerAdmin.js');

/*MODAL*/
const modalScanComment = require('../schema/ScanComment.js');


router.post('/create', function(req, res, next) {
	let promise  =  controllerAdmin.getAdminSetup();
	// promise.then(success=>{
		let data = { 
			fb_id              : 		req.body.fb_id 	,
			type_order         :		req.body.type_order,
			time_create        :		new Date().getTime(),
		}

		controllerScanComment.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else { 
				return res.json( {code : 200 , data : api } );
			}
		})
	// })
	// .catch(e=>{
	// 		return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
	// })
	
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

router.put('/update/:id', function(req, res, next) {
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

module.exports = router;
