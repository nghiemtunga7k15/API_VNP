var express = require('express');
var router = express.Router();
/*CONTROLLER*/
const controllerBuffLike = require('../controller/controllerBuffLike.js');
const controllerAdmin = require('../controller/controllerAdmin.js');

/*MODAL*/
const modalBuffLike = require('../schema/BuffLike.js');
const modalFbUser = require('../schema/FaceBookUser.js');

router.post('/create', function(req, res, next) {

	function getAdminSetup() {
		return new Promise(function(resolve, reject) { 
			controllerAdmin.getListSetup(function ( err , list){
				if(err) return reject(err);
				return resolve(list);
			})
		 });
	}
	let promise = getAdminSetup();
	promise.then(success=>{
		let data = { 
			video_id             :		req.body.video_id ,
			type_buff            :		req.body.type_buff ,   
			quantity             : 		req.body.quantity ,	
			price                :		success[0].price_like ,               
			total_price_pay      : 		parseInt(req.body.quantity) * parseInt(success[0].price_like),
			time_delay           : 		req.body.time_delay ,	
			time_buff_like_done  : 		req.body.time_buff_like_done ,	
			note                 : 		req.body.note ,	
			status               :      req.body.status, 
			like_max             :      success[0].like_max,
			time_create          : 		new Date().getTime() ,
			time_done            : 		req.body.time_done ,	
			time_update          : 		req.body.time_update ,	
		}
		controllerBuffLike.handleCreate(data, function (err , api) {
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Add'} } );
			} else { 
				return res.json( { code : 200 ,  data :  { msg : 'Add Success'}} );					
			}
		})	
	})
	.catch(e=>{
			return res.json( {code : 404 , data : { msg : 'Not Add'} } );
	})
});
router.get('/detail-order', function(req, res, next) {
		function getCookie(idLike) {
		return new Promise(function(resolve , reject){
			controllerBuffLike.getDetailBuffLike( idLike ,function ( err , data){
				if(err)  {
					return reject(err);
				} else {
					modalFbUser.find({status : 1 })
						.limit(parseInt(data.quantity))
						.exec(function(err, cookie){
							if (err) {
								return reject(err);
							} else {
								return resolve(cookie);
				   				
							}
					})
				}
				})
			})
		}
		controllerBuffLike.getOrderBuffLike(  function ( err , orderBuffEye){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Get List'} } );
			} else {
   				if ( orderBuffEye.length > 0  )  {
   					let promiseGetCookie = getCookie(orderBuffEye[0].idLike);
						promiseGetCookie.then( dataAndCookie =>{
							controllerBuffLike.handleUpdateBuffLike(orderBuffEye[0].idLike , function(err , success){
								
							return res.json( { code : 200 ,  data : orderBuffEye , cookie : dataAndCookie } );
							})
						})
						.catch(e=>{
							return res.json( {code : 404 , data : { msg : 'Not Get'} } );
						})
   				} else{
   						return res.json( {code : 404 , data : { msg : 'Not Found Order'} } );
   				}

			}		
		});		
});


router.get('/list-all', function(req, res, next) {
		let _limit = parseInt(req.query.page);
		let page = parseInt(req.query.page);
		if (!_limit || _limit == null) {
			_limit = 20;
		}
		if (!page || page == null) {
			page = 1;
		}

		controllerBuffLike.getListBuffLikeAll( _limit , page , function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Get List'} } );
			} else {
				modalBuffLike.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : { msg : 'Not Get List'} } );
   					} else {
						return res.json( { code : 200 ,  data : listBuffEye.length > 0 ? listBuffEye : 'Data Not Found' , total : totalRecord } );
   					}
				})

			}
		})
});
router.get('/detail/:id', function(req, res, next) {
		let idLike = parseInt(req.params.id);
		controllerBuffLike.getDetailBuffLike( idLike ,function ( err , detailBuffCmt){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Get Detail'} } );
			} else {
				return res.json( {code : 200 , data : detailBuffCmt } );
			}
		})
});


router.put('/update/:id', function(req, res, next) {
		let idLike = parseInt(req.params.id);
		function getAdminSetup() {
			return new Promise(function(resolve, reject) { 
				controllerAdmin.getListSetup(function ( err , list){
					if(err) return reject(err);
					return resolve(list);
				})
			});
		}

		let promise = getAdminSetup();
		promise.then(success=>{
			let quantity = req.body.quantity ? req.body.quantity : 0;
			let _comments_count = req.body.comments_count ? _comments_count : 0
			let data = { 
				video_id             :		req.body.video_id ,
				type_buff            :		req.body.type_buff ,   
				quantity             : 		req.body.quantity ,	
				price                :		success[0].price_like ,               
				total_price_pay      : 		parseInt(quantity) * parseInt(success[0].price_like),
				time_delay           : 		req.body.time_delay ,	
				time_buff_like_done  : 		req.body.time_buff_like_done ,	
				note                 : 		req.body.note ,	
				status               :      req.body.status,
				like_max             :      success[0].like_max,
				time_done            : 		req.body.time_done ,	
				time_update          : 		new Date().getTime() ,	
			}
			controllerBuffLike.handleUpdate( idLike , data ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Not Update'} } );
				} else {
					return res.json( {code : 200 , data : { msg : 'Update Success'} } );
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Not Add'} } );
		})
});

router.delete('/delete/:id', function(req, res, next) {
		let idLike = parseInt(req.params.id);
		controllerBuffLike.handleDelete( idLike ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Delete'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Delete Success'} } );
			}
		})
});


module.exports = router;
