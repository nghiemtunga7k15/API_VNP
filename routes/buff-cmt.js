var express = require('express');
var router = express.Router();
/*CONTROLLER*/
const controllerBuffComment = require('../controller/controllerBuffComment.js');
const controllerAdmin = require('../controller/controllerAdmin.js');

/*MODAL*/
const modalBuffComment = require('../schema/BuffComment.js');
const modalFbUser = require('../schema/FaceBookUser.js');

router.post('/create', function(req, res, next) {
	let promise  =  controllerAdmin.getAdminSetup();
	promise.then(success=>{
		let price;
		if ( parseInt(req.body.type_buff) == 0 ) {
			price = success[0].price_comment_randum;
		} else {  
			price = success[0].price_comment_choose;
		}; 

		let comments = req.body.comments.toString();

		let arrComment  = comments.split(";");

		let data = { 
			video_id             :		req.body.video_id ,
			type_buff            :		req.body.type_buff ,   // 1 Chọn ngẫu nhiên   0 Chọn từ User
			price                :		price ,                // 1 Chọn ngẫu nhiên  price = 1   0 Chọn từ User price =2
			comments             : 		arrComment ,	
			comments_count       : 		req.body.comments_count ,	
			total_price_pay      : 		parseInt(req.body.comments_count) * parseInt(price),
			time_type            : 		req.body.time_type ,	
			time_value           : 		req.body.time_value ,	
			note                 : 		req.body.note ,	
			status               :      req.body.status,
			comment_max          :      success[0].comment_max,
			time_create          : 		new Date().getTime() ,
			time_done            : 		req.body.time_done ,	
			time_update          : 		req.body.time_update ,	
		}



		controllerBuffComment.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else { 
				return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
			}
		})	
	})
	.catch(e=>{
			return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
	})
});
router.get('/list', function(req, res, next) {
		let _limit = req.query.limit ?  parseInt(req.query.limit) : 20;
		let page = req.query.page ?  parseInt(req.query.page) : 1;
		controllerBuffComment.getListBuffComment( _limit , page , function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				modalBuffComment.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : [] } );
   					} else {
						return res.json( {code : 200 , data : listBuffEye ,  page : page , limit : _limit , total : totalRecord } );
   					}
				})

			}
		})
});
router.get('/detail-order', function(req, res, next) {
		controllerBuffComment.getOrderBuffComment(function ( err , orderDetail){
			if(err) {
					return res.json( {code : 404 , data : [] } );

			} else {
					modalFbUser.find( { status : 1 })
						.limit(parseInt(orderDetail.comments_count))
						.exec(function(err, cookies){
							if (err) {
								return res.json( {code : 404 , data : [] } );
							} else {
								return res.json( {code : 200 , data : orderDetail , cookies : cookies  } );				   				
							}
					})
			}	
		})
});
router.get('/detail/:id', function(req, res, next) {
		let id = parseInt(req.params.id);
		controllerBuffComment.getDetailBuffComment( id ,function ( err , detailBuffEye){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {
				return res.json( {code : 200 , data : detailBuffEye } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let idVideo = parseInt(req.params.id);
		let promise  =  controllerAdmin.getAdminSetup();
		promise.then(success=>{
			let price;
			if ( parseInt(req.body.type_buff) == 0 ) {
				price = success[0].price_comment_choose;
			} else {  
				price = success[0].price_comment_randum;
			};

			if ( !req.body.type_buff ) {
				price = 10;
			}


			let data = req.body;

			if ( req.body.comments_count ) {
				data.total_price_pay = parseInt(req.body.comments_count) * price;
			}

			if ( req.body.comments ) {
				let comments = req.body.comments.toString();
				let arrComment  = comments.split(";");
				data.comments  = arrComment
			}
			data.time_update = new Date().getTime();
			controllerBuffComment.handleUpdate( idVideo , data ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
				} else {
					controllerBuffComment.getDetailBuffComment( idVideo ,function ( err , detailBuffComment){
							return res.json( {code : 200 , data : detailBuffComment } );
					})
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
		})
});

router.delete('/delete/:id', function(req, res, next) {
		let idVideo = parseInt(req.params.id);
		controllerBuffComment.handleDelete( idVideo ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
			}
		})
});


module.exports = router;
