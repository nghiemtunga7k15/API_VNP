var express = require('express');
var router = express.Router();
/*CONTROLLER*/
const controllerBuffEye = require('../controller/controllerBuffEye.js');
/*MODAL*/
const modalBuffEye = require('../schema/BuffEye.js');
const modalFbLive = require('../schema/FaceBookLive.js');
const modalFbUser = require('../schema/FaceBookUser.js');
/* GET LIVE */
router.get('/fb-live', function(req, res, next) {
		modalBuffEye.find({status : 0}).sort({time_create: -1}).limit(1).exec(function(err, data){
				if (err) {
					return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
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
					return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
				} else {
					modalFbUser.count({}, function( err, totalRecord){
	   					if ( err ) {
	   						return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
	   					} else {
							return res.json( {code : 200 , data : data  , page : page , limit : _limit , total : totalRecord } );
	   					}
					})
				}
		})
});

router.post('/create', function(req, res, next) {
	let data = { 
		status     : 		req.body.status,
		process_id :		req.body.process_id ,
		note       :		req.body.note 		,
		last_time_check: 	req.body.last_time_check ,
		time_create: 		new Date().getTime() ,
		video_id   : 		req.body.video_id 	,
		time_buff  : 		req.body.time_buff 	,
		eye_num    :		req.body.eye_num
	}
	controllerBuffEye.handleCreate(data, function (err , api) {
		if(err)  {
			return res.json( {code : 404 , data : { msg : 'Not Add'} } );
		} else { 
			return res.json( {code : 200 , data : api } );
		}
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
		controllerBuffEye.getListBuffEye( _limit , page , function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Get List'} } );
			} else {
				modalBuffEye.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : { msg : 'Not Get List'} } );
   					} else {
						return res.json( {code : 200 , data : listBuffEye ,  page : page , limit : _limit , total : totalRecord } );
   					}
				})

			}
		})
});
router.get('/detail/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		controllerBuffEye.getDetailBuffEye( id ,function ( err , detailBuffEye){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Get Detail'} } );
			} else {
				return res.json( {code : 200 , data : detailBuffEye } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		let data = { 
			status     : 		req.body.status,
			process_id :		req.body.process_id ,
			note       :		req.body.note 		,
			last_time_check: 	req.body.last_time_check ,
			time_create: 		new Date().getTime() ,
			video_id   : 		req.body.video_id 	,
			time_buff  : 		req.body.time_buff 	,
			eye_num    :		req.body.eye_num
		}

		controllerBuffEye.handleUpdateBuffEye( id , data ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Update'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Update Success'} } );
			}
		})
});

router.delete('/delete/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		controllerBuffEye.handleDelete( id ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Delete'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Delete Success'} } );
			}
		})
});

// router.post('/api/', function(req, res, next) {
// 		if( req.body.link_live == null || req.body.text == null || req.body.status == null) {
// 			return res.json( {
// 						code : 200 
// 					} );
// 		}
//   		modalFbUser.find({status : 1 })
// 			.limit(10)
// 			.select('user_id fb_dtsg cookie')
// 			.exec(function(err, data){
// 				if (err) {
// 					return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
// 				} else {
// 					return res.json( {
// 						code : 200 , 
// 						data : data , 
// 						link_live : req.body.link_live , 
// 						text      : req.body.text,
// 						status    : 0
// 					} );
	   				
// 				}
// 		})
// });


module.exports = router;
