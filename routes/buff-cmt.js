var express = require('express');
var router = express.Router();
/*CONTROLLER*/
const controllerBuffComment = require('../controller/controllerBuffComment.js');
/*MODAL*/
const modalBuffComment = require('../schema/BuffComment.js');
const modalFbUser = require('../schema/FaceBookUser.js');

router.post('/create', function(req, res, next) {
	let data = { 
		video_id   :		req.body.video_id ,
		type_buff  :		req.body.type_buff ,
		price      :		req.body.price ,
		comments   : 		req.body.comments ,	
		comments_count       : 		req.body.comments_count ,	
		total_price_pay      : parseInt(req.body.comments_count) * parseInt(req.body.price),
		status     :        req.body.status,
 		delays     :		req.body.delays ,
		time_create: 		new Date().getTime() ,
		time_done  : 		req.body.time_done ,	
		time_delay : 		req.body.time_delay ,	
		time_buff_eye_done   : 		req.body.time_buff_eye_done ,	
		time_update          : 		req.body.time_update ,	
	}
	controllerBuffComment.handleCreate(data, function (err , api) {
		if(err)  {
			return res.json( {code : 404 , data : { msg : 'Not Add'} } );
		} else { 
			let numberCmts = parseInt(api.comments_count);
			modalFbUser.find({status : 1 })
				.limit(numberCmts)
				.select('user_id fb_dtsg cookie')
				.exec(function(err, cookies){
					if (err) {
						return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
					} else {
						controllerBuffComment.handleUpdateBuffComment( parseInt(api.idVideo) , function (err , updateSucess){		
							return res.json( {
								code : 200 , 
								data : api , 
								cookie : cookies
							} );
						});
		   				
					}
			})
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
		controllerBuffComment.getListBuffComment( _limit , page , function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Get List'} } );
			} else {
				modalBuffComment.count({}, function( err, totalRecord){
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
		controllerBuffComment.getDetailBuffComment( id ,function ( err , detailBuffEye){
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
			video_id   :		req.body.video_id ,
			type_buff  :		req.body.type_buff ,
			price      :		req.body.price ,
			comments   : 		req.body.comments ,	
			comments_count       : 		req.body.comments_count ,	
			total_price_pay      : parseInt(req.body.comments_count) * parseInt(req.body.price),
			status     :        req.body.status,
	 		delays     :		req.body.delays ,
			time_done  : 		req.body.time_done ,	
			time_delay : 		req.body.time_delay ,	
			time_buff_eye_done   : 		req.body.time_buff_eye_done ,	
			time_update          : 		new Date().getTime() ,	
		}

		controllerBuffComment.handleUpdate( id , data ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Update'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Update Success'} } );
			}
		})
});

router.delete('/delete/:id', function(req, res, next) {
		let idVideo = parseInt(req.params.id);
		controllerBuffComment.handleDelete( idVideo ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Delete'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Delete Success'} } );
			}
		})
});


module.exports = router;
