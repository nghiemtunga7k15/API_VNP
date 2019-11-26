var express = require('express');
var router = express.Router();
const ApiBuffEyeController = require('../controller/apiBuffEye.js');


const SchemaFbLive = require('../Schema/fb_live.js');

const SchemaFbUser = require('../Schema/fb_user.js');
/* GET USER */
router.get('/api/v1/fb-live/', function(req, res, next) {
		SchemaFbLive.find({status : 0}).sort({time_create: -1}).limit(1).exec(function(err, data){
				if (err) {
					res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
				} else {
					res.json( {code : 200 , data : data } );
				}
		})	
});
/* GET LIVE */
router.get('/api/v1/fb-user', function(req, res, next) {
		let _limit = parseInt(req.query.limit);
		let page = parseInt(req.query.page);
		SchemaFbUser.find({status : 1 }).sort({ last_time_use : 1 })
			.limit(_limit)
    		.skip( (_limit * page ) -  _limit)
			.exec(function(err, data){
				if (err) {
					res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
				} else {
					res.json( {code : 200 , data : data } );
				}
		})
});

router.post('/api/v1/buff-eye/create', function(req, res, next) {
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
	ApiBuffEyeController.handleAddBuffEye(data, function (err , api) {
		if(err)  {
			res.json( {code : 404 , data : { msg : 'Not Add'} } );
		} else { 
			res.json( {code : 200 , data : api } );
		}
	})
});
router.get('/api/v1/buff-eye/list', function(req, res, next) {
		let _limit = parseInt(req.query.limit);
		let page = parseInt(req.query.page);
		ApiBuffEyeController.handleGetListBuffEye( _limit , page , function ( err , listBuffEye){
			if(err) {
				res.json( {code : 404 , data : { msg : 'Not Get List'} } );
			} else {
				res.json( {code : 200 , data : listBuffEye } );
			}
		})
});
router.get('/api/v1/buff-eye/detail/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		ApiBuffEyeController.handleGetDetailBuffEye( id ,function ( err , detailBuffEye){
			if(err)  {
				res.json( {code : 404 , data : { msg : 'Not Get Detail'} } );
			} else {
				res.json( {code : 200 , data : detailBuffEye } );
			}
		})
});

router.put('/api/v1/buff-eye/update/:id', function(req, res, next) {
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

		ApiBuffEyeController.handleGetUpdateBuffEye( id , data ,function ( err , updateSuccess){
			if(err)  {
				res.json( {code : 404 , data : { msg : 'Not Update'} } );
			} else {
				res.json( {code : 200 , data : { msg : 'Update Success'} } );
			}
		})
});

router.delete('/api/v1/buff-eye/delete/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		ApiBuffEyeController.handleDeleteBuffEye( id ,function ( err , updateSuccess){
			if(err)  {
				res.json( {code : 404 , data : { msg : 'Not Delete'} } );
			} else {
				res.json( {code : 200 , data : { msg : 'Delete Success'} } );
			}
		})
});

module.exports = router;
