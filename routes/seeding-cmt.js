var express = require('express');
var router = express.Router();
var moment = require('moment');
var fs = require('fs');

/*CONTROLLER*/
const controllerSeedingComment = require('../controller/controllerSeedingComment.js');
const controllerAdmin = require('../controller/controllerAdmin.js');

/*MODAL*/
const modalSeedingComment = require('../schema/SeedingComment.js');

router.post('/create', function(req, res, next) {
	let promise  =  controllerAdmin.getAdminSetup();
	promise.then(success=>{
		let price = parseInt(success[0].price_seeding_cmt);
		let data = { 
			key_word                      : 		req.body.key_word ,
			content_seeding_post          : 		req.body.content_seeding_post ,
			content_seeding_reply_post    : 		req.body.content_seeding_reply_post ,
			quantity_seeding              : 		req.body.quantity_seeding ,
			total_price_pay               : 		parseInt(req.body.quantity_seeding) * price ,
			time_create                   :		new Date().getTime(),
		}

		

		controllerSeedingComment.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else { 
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
		controllerSeedingComment.getListOrderSeedingComment( _limit , page ,  function ( err , listOrderSeedingCmt){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				modalSeedingComment.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : [] } );
   					} else {
						return res.json( {code : 200 , data : listOrderSeedingCmt ,  page : page , limit : _limit , total : totalRecord } );
   					}
				})

			}
		})
});


router.get('/detail/:id', function(req, res, next) {
		let idSeedingCmt = parseInt(req.params.id);
		controllerSeedingComment.getDetailSeedingComment( idSeedingCmt ,function ( err , detailOrderSeedingCom){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {
				return res.json( {code : 200 , data : detailOrderSeedingCom } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let idSeedingCmt = parseInt(req.params.id);
		let promise  =  controllerAdmin.getAdminSetup();
		promise.then(success=>{
			let price = parseInt(success[0].price_seeding_cmt);
			let data = req.body;
			if ( req.body.quantity_seeding ) {
				data.total_price_pay = parseInt(req.body.quantity_seeding) * price ;
			}
			data.time_update = new Date().getTime();
			controllerSeedingComment.handleUpdateSeedingComment( idSeedingCmt , req.body ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : [] } );
				} else {
					controllerSeedingComment.getDetailSeedingComment( idSeedingCmt ,function ( err , detailOrderSeedingCom){	
						return res.json( {code : 200 , data : detailOrderSeedingCom } );
					})
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
		})
});


router.delete('/delete/:id', function(req, res, next) {
		let idSeedingCmt = parseInt(req.params.id);
		controllerSeedingComment.handleDelete( idSeedingCmt ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
			}
		})
});



module.exports = router;
