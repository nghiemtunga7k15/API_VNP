var express = require('express');
var router = express.Router();
const axios = require('axios');

/*CONTROLLER*/
const controllerBuffLike = require('../../controller/FVI/controllerBuffLike.js');
const controllerAdmin = require('../../controller/controllerAdmin.js');

/*MODAL*/
const modalBuffLike = require('../../schema/FVI/BuffLike.js');
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
					let typeBuff = req.body.type_buff.toString();
					let arrBuff  = typeBuff.split(";");
					let like  = arrBuff[0] && arrBuff[0] != '' ? parseInt(arrBuff[0]) : 0;
					let love  = arrBuff[1] && arrBuff[1] != '' ? parseInt(arrBuff[1]) : 0;
					let haha  = arrBuff[2] && arrBuff[2] != '' ? parseInt(arrBuff[2]) : 0;
					let wow   = arrBuff[3] && arrBuff[3] != '' ? parseInt(arrBuff[3]) : 0;
					let sad   = arrBuff[4] && arrBuff[4] != '' ? parseInt(arrBuff[4]) : 0;
					let angry = arrBuff[5] && arrBuff[5] != '' ? parseInt(arrBuff[5]) : 0;
					let quantity = like + love + haha + wow + sad + angry;
					promise.then(success=>{
						let data = { 
							video_id             :		id_post ,
							type_buff            :		{
								like    : like,
								love    : love,
								haha    : haha,
								wow     : wow,
								sad     : sad,
								angry   : angry,
							},   
							quantity             : 		quantity ,	
							price                :		success[0].price_like ,               
							total_price_pay      : 		quantity * parseInt(success[0].price_like),
							time_type            : 		req.body.time_type ,	
							time_value           : 		req.body.time_value ,	
							note                 : 		req.body.note ,	
							status               :      req.body.status, 
							like_max             :      success[0].like_max,
							time_create          : 		new Date().getTime() ,
							time_done            : 		req.body.time_done ,	
							time_update          : 		req.body.time_update ,	
						}
						controllerBuffLike.handleCreate(data, function (err , api) {
							if(err)  {
								return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
							} else { 
								return res.json( { code : 200 ,  data :  api } );					
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

router.get('/detail-order', function(req, res, next) {
		controllerBuffLike.getOrderBuffLike(  function ( err , orderBuffLike){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Found'} } );
			} else {
				modalFbUser.find({status : 1 })
						.limit(parseInt(orderBuffLike.quantity))
						.exec(function(err, cookie){
							if (err) {
								return res.json( {code : 404 , data : { msg : 'Not Found'} } );
							} else {
								return res.json( {code : 200 , data : orderBuffLike , cookies : cookie  } );	
							}
				})
			}
		});	
});


router.get('/list', function(req, res, next) {
		let _limit = req.query.limit ?  parseInt(req.query.limit) : 20;
		let page = req.query.page ?  parseInt(req.query.page) : 1;
		

		controllerBuffLike.getListBuffLikeAll( _limit , page , function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Found'} } );
			} else {
				modalBuffLike.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : { msg : 'Not Found'} } );
   					} else {
						return res.json( { code : 200 ,  data : listBuffEye.length > 0 ? listBuffEye :[], total : totalRecord  , limit : _limit  , page :page} );
   					}
				})
			}
		})
});

router.get('/detail/:id', function(req, res, next) {
		let idLike = parseInt(req.params.id);
		controllerBuffLike.getDetailBuffLike( idLike ,function ( err , detailBuffCmt){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Found'} } );
			} else {
				return res.json( {code : 200 , data : detailBuffCmt } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let idLike = parseInt(req.params.id);
		let promise  =  controllerAdmin.getAdminSetup();
		promise.then(success=>{
			let data = req.body;
			if ( req.body.type_buff ) {
				let typeBuff = req.body.type_buff.toString();
				let arrBuff  = typeBuff.split(";");
				let like  = arrBuff[0] && arrBuff[0] != '' ? parseInt(arrBuff[0]) : 0;
				let love  = arrBuff[1] && arrBuff[1] != '' ? parseInt(arrBuff[1]) : 0;
				let haha  = arrBuff[2] && arrBuff[2] != '' ? parseInt(arrBuff[2]) : 0;
				let wow   = arrBuff[3] && arrBuff[3] != '' ? parseInt(arrBuff[3]) : 0;
				let sad   = arrBuff[4] && arrBuff[4] != '' ? parseInt(arrBuff[4]) : 0;
				let angry = arrBuff[5] && arrBuff[5] != '' ? parseInt(arrBuff[5]) : 0;
				let quantity = like + love + haha + wow + sad + angry;
				data.type_buff = {
					like    : like,
					love    : love,
					haha    : haha,
					wow     : wow,
					sad     : sad,
					angry   : angry,
				}
				data.quantity = quantity;
				data.total_price_pay = parseInt(success[0].price_like) * parseInt(quantity ) ; 
			}

			data.time_update = new Date().getTime();			
			controllerBuffLike.handleUpdate( idLike , data ,  true ,function ( err , updateSuccess){
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

router.delete('/delete/:id', function(req, res, next) {
		let idLike = parseInt(req.params.id);
		controllerBuffLike.handleDelete( idLike ,function ( err , updateSuccess){
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
	controllerBuffLike.handleUpdate( video_id , data , false ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
				} else {
					return res.json( {code : 404 , data : { msg : 'Thành Công'} } );
				}
	})
});

router.get('/search',  function(req, res, next) {
	let key_search = req.query.id;
  	modalBuffLike.find({video_id:{'$regex' : `^.*${key_search}.*$`, '$options' : 'i'}} ,function(err,data) {
   		if(err){
   			return res.json( {code : 404 , data : [] } );
   		}else{
   			return res.json( {code : 200 , data : data } );
   		}
   	})	
});
module.exports = router;
