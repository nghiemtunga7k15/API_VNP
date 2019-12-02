var express = require('express');
var router = express.Router();
/*CONTROLLER*/
const controllerBuffEye = require('../controller/controllerBuffEye.js');
const controllerAdmin = require('../controller/controllerAdmin.js');

/*MODAL*/
const modalBuffEye = require('../schema/BuffEye.js');
const modalFbLive = require('../schema/FaceBookLive.js');
const modalFbUser = require('../schema/FaceBookUser.js');
/* GET LIVE */
router.get('/fb-live', function(req, res, next) {
		modalBuffEye.find({status : 0}).sort({time_create: -1}).limit(1).exec(function(err, data){
				if (err) {
					return res.json( {code : 404 , data : [] } );
				} else {
					return res.json( {code : 200 , data : data } );
				}
		})	
});
/* GET USER */
router.get('/fb-user', function(req, res, next) {
		let _limit = parseInt(req.query.limit);
		let page = parseInt(req.query.page);
		let status = req.query.status ? parseInt(req.query.status) : 1 ;
		if (!_limit || _limit == null) {
			_limit = 20;
		}
		if (!page || page == null) {
			page = 1;
		}
		modalFbUser.find({status : status }).sort({ last_time_use : 1 })
			.limit(_limit)
    		.skip( (_limit * page ) -  _limit)
			.exec(function(err, data){
				if (err) {
					return res.json( {code : 404 , data : [] } );
				} else {
					modalFbUser.count({}, function( err, totalRecord){
	   					if ( err ) {
	   						return res.json( {code : 404 , data : [] } );
	   					} else {
							return res.json( {code : 200 , data : data  , page : page , limit : _limit , total : totalRecord } );
	   					}
					})
				}
		})
});

router.post('/create', function(req, res, next) {

	let promise  =  	controllerAdmin.getAdminSetup();

	promise.then(success=>{

		let data = { 
			video_id           : 		req.body.video_id 	,
			view               :		req.body.view,
			price_one_eye      :		success[0].price_one_eye,
			total_price_pay    :		parseInt(success[0].price_one_eye) * parseInt(req.body.view),
			time_type          :		req.body.time_type,
			time_value         :		req.body.time_value,
			note               : 		req.body.note,
			status             : 		req.body.status,
			view_max           :		success[0].view_max,
			time_create        : 		new Date().getTime() ,
			time_done      	   :		req.body.time_done,
			time_update        :		req.body.time_update,
			last_time_check    :		req.body.last_time_check,
		}

		controllerBuffEye.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : [] } );
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
		let status =   parseInt(req.query.status);
		let sort_name = req.query.sort_name;
		let sort_value = req.query.sort_value;
		if (!_limit || _limit == null) {
			_limit = 20;
		}
		if (!page || page == null) {
			page = 1;
		}
		controllerBuffEye.getListBuffEye( _limit , page , status , sort_name , sort_value  , function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				modalBuffEye.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : [] } );
   					} else {
						return res.json( {code : 200 , data : listBuffEye ,  page : page , limit : _limit , total : totalRecord  , v : 10} );
   					}
				})

			}
		})
});

router.get('/detail-order', function(req, res, next) {
		controllerBuffEye.getOrderBuffEye(  function ( err , orderBuffEye){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				console.log(orderBuffEye)
				modalFbUser.find({status : 1 })
						.limit(parseInt(orderBuffEye.view))
						.exec(function(err, cookie){
							if (err) {
								return res.json( {code : 404 , data : [] } );
							} else {
								return res.json( {code : 200 , data : orderBuffEye , cookies : cookie  } );	
							}
				})
			}
		});	
});

router.get('/detail/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		controllerBuffEye.getDetailBuffEye( id ,function ( err , detailBuffEye){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {
				return res.json( {code : 200 , data : detailBuffEye } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		let view  = req.body.view ? req.body.view : 0;
		let promise  =  	controllerAdmin.getAdminSetup();
		promise.then(success=>{
			let data = req.body;
			if ( req.body.view ) {
				data.total_price_pay = parseInt(success[0].price_one_eye) * parseInt(req.body.view);
			}
			data.time_update = new Date().getTime();

			controllerBuffEye.handleUpdateBuffEye( id , req.body ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
				} else {
					controllerBuffEye.getDetailBuffEye( id ,function ( err , detailBuffEye){	
						return res.json( {code : 200 , data : detailBuffEye } );
					})
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );

		})
});

router.delete('/delete/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		controllerBuffEye.handleDelete( id ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Thành Công '} } );
			}
		})
});

module.exports = router;
