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

	let typeBuff = req.body.type_buff.toString();

	let arrBuff  = typeBuff.split(",");

	let like  = arrBuff[0] && arrBuff[0] != '' ? parseInt(arrBuff[0]) : 0;
	let love  = arrBuff[1] && arrBuff[1] != '' ? parseInt(arrBuff[1]) : 0;
	let haha  = arrBuff[2] && arrBuff[2] != '' ? parseInt(arrBuff[2]) : 0;
	let wow   = arrBuff[3] && arrBuff[3] != '' ? parseInt(arrBuff[3]) : 0;
	let sad   = arrBuff[4] && arrBuff[4] != '' ? parseInt(arrBuff[4]) : 0;
	let angry = arrBuff[5] && arrBuff[5] != '' ? parseInt(arrBuff[5]) : 0;
	let quantity = like + love + haha + wow + sad + angry;
	promise.then(success=>{
		let data = { 
			video_id             :		req.body.video_id ,
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
		controllerBuffLike.getOrderBuffLike(  function ( err , orderBuffLike){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Found'} } );
			} else {
				console.log(orderBuffLike)
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
			let data = req.body;
			let typeBuff = req.body.type_buff.toString();
			let arrBuff  = typeBuff.split(",");
			let like  = arrBuff[0] && arrBuff[0] != '' ? parseInt(arrBuff[0]) : 0;
			let love  = arrBuff[1] && arrBuff[1] != '' ? parseInt(arrBuff[1]) : 0;
			let haha  = arrBuff[2] && arrBuff[2] != '' ? parseInt(arrBuff[2]) : 0;
			let wow   = arrBuff[3] && arrBuff[3] != '' ? parseInt(arrBuff[3]) : 0;
			let sad   = arrBuff[4] && arrBuff[4] != '' ? parseInt(arrBuff[4]) : 0;
			let angry = arrBuff[5] && arrBuff[5] != '' ? parseInt(arrBuff[5]) : 0;
			let quantity = like + love + haha + wow + sad + angry;

			data.time_update = new Date().getTime();
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
			
			controllerBuffLike.handleUpdate( idLike , data ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Not Update'} } );
				} else {
					return res.json( {code : 200 , data : { msg : 'Update Success'} } );
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Not Update'} } );
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
