var express = require('express');
var router = express.Router();
const axios = require('axios');

/*CONTROLLER*/
const controllerBuffComment = require('../../controller/FVI/controllerBuffComment.js');
const controllerAdmin = require('../../controller/controllerAdmin.js');

/*MODAL*/
const modalBuffComment = require('../../schema/FVI/BuffComment.js');
const modalFbUser = require('../../schema/FaceBookUser.js');

/*TOOL*/
const tool = require('../../tool');

router.post('/create', async function(req, res, next) {
	let id_post = tool.convertUrlToID(req.body.video_id);
	if (!id_post) {
		return res.json( {code : 404 , data : { msg : 'Thất Bại' , err : 'ID Sai' } } );
	}

	try {
	   const response = await axios.get(`https://graph.facebook.com/${id_post}?access_token=EAAGNO4a7r2wBAB8XHEoc5xklAq4q2OTZCzW2rfAyt5OhJmp5xLS3PZC6z0qlzZBiAntZAub0PSUwQKon0gOqPqlCYIOqNCiheeFeqIEwDI37yjMsLVhbVT1SzTQPDPEXhRQyOqU5vaokjLii0WlhgO7LHmZAfH4CykeHDi4Y8wgZDZD`);
	   	    if ( response && response.data.from ) {
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
						video_id             :		id_post ,
						type_buff            :		req.body.type_buff ,   // 1 Chọn ngẫu nhiên   0 Chọn từ User
						price                :		price ,                //  Chọn ngẫu nhiên  price = 10   0 Chọn từ User price = 15
						comments             : 		arrComment ,	
						comments_count       : 		arrComment.length ,	
						total_price_pay      : 		parseInt(arrComment.length) * parseInt(price),
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
							return res.json( {code : 200 , data : api } );
						}
					})	
				})
				.catch(e=>{
						return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
				})
		    }else{
				return res.json( {code : 404 , data : { msg : 'Thất Bại' , err : 'ID Không Tồn Tại ' } } );
		    }
	} catch (error) {
	  	return res.json( {code : 404 , data : { msg : 'Thất Bại' , err : 'ID Không Tồn Tại' } } );	  
	}	

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
					modalFbUser.find( { status : 1  , type : 1 } )
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
			controllerBuffComment.handleUpdate( idVideo , data , true ,function ( err , updateSuccess){
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

router.put('/update-result/:id', function(req, res, next) {
	let video_id = req.params.id.toString();
	let data     = req.body;
	controllerBuffComment.handleUpdate( video_id , data , false ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
				} else {
					return res.json( {code : 404 , data : { msg : 'Thành Công'} } );
				}
	})
});

router.get('/search',  function(req, res, next) {
	let key_search = req.query.id;
  	modalBuffComment.find({video_id:{'$regex' : `^.*${key_search}.*$`, '$options' : 'i'}} ,function(err,data) {
   		if(err){
   			return res.json( {code : 404 , data : [] } );
   		}else{
   			return res.json( {code : 200 , data : data } );

   		}
   	})	
});


module.exports = router;
