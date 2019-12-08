var express = require('express');
var router = express.Router();
var moment = require('moment');

/*CONTROLLER*/
const controllerBuffVipEye = require('../../controller/FVI/controllerBuffVipEye.js');
const controllerAdmin = require('../../controller/controllerAdmin.js');

/*MODAL*/
const modalBuffVipEye = require('../../schema/FVI/VipEye.js');

/*TOOL*/
const tool = require('../../tool');


router.post('/create', function(req, res, next) {
	let id_post = tool.convertUrlToID(req.body.fb_id);
	if (!id_post) {
		return res.json( {code : 404 , data : { msg : 'Thất Bại' , err : 'ID Post Not Found' } } );
	}
	let promise  =  controllerAdmin.getAdminSetup();
	promise.then(success=>{
		let timeOneDay  = 60 * 60 * 24 * 1000;
		// let dayExpired  = new Date().getTime() + (timeOneDay * parseInt(req.body.time_vip_eye));
		let dayExpired  = new Date().getTime() + (60 * 10 * 1000);
		let price = parseInt(success[0].price_vip_eye);
		let data = { 
			fb_id              : 		id_post 	,
			name               :		req.body.name,
			choose_option_eye  :		req.body.choose_option_eye,
			time_vip_eye       :		req.body.time_vip_eye,
			total_price_pay    :		req.body.choose_option_eye * price,
			note               : 		req.body.note,
			status             : 		req.body.status,
			time_create        : 		new Date().getTime(),
			time_expired       :		dayExpired,
		}
		controllerBuffVipEye.handleCreate(data, function (err , api) {
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
		let status =   parseInt(req.query.status);
		let sort_name = req.query.sort_name;
		let sort_value = req.query.sort_value;
		if (!_limit || _limit == null) {
			_limit = 20;
		}
		if (!page || page == null) {
			page = 1;
		}
		controllerBuffVipEye.getListBuffEye( _limit , page , status , sort_name , sort_value  , function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				modalBuffVipEye.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : [] } );
   					} else {
						return res.json( {code : 200 , data : listBuffEye ,  page : page , limit : _limit , total : totalRecord } );
   					}
				})

			}
		})
});


router.get('/detail/:id', function(req, res, next) {
		let idVipEye = parseInt(req.params.id);
		controllerBuffVipEye.getDetailBuffVipEye( idVipEye ,function ( err , detailBuffEye){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {
				return res.json( {code : 200 , data : detailBuffEye } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let idVipEye = parseInt(req.params.id);
		let promise  =  controllerAdmin.getAdminSetup();
		promise.then(success=>{
			let price = parseInt(success[0].price_vip_eye);
			let timeOneDay  = 60 * 60 * 24 * 1000;

			let data = req.body;
			if ( req.body.choose_option_eye ) {
					data.total_price_pay = parseInt(req.body.choose_option_eye) * price;
			}
			if ( req.body.time_vip_eye ) {
					let dayExpired  = moment(new Date().getTime() + parseInt(req.body.time_vip_eye) * timeOneDay).format('DD-MM-YYYY');
					data.time_expired =  dayExpired;
			}
			data.time_update = new Date().getTime();

			controllerBuffVipEye.handleUpdateBuffVipEye( idVipEye , true , req.body ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : [] } );
				} else {
					controllerBuffVipEye.getDetailBuffVipEye( idVipEye ,function ( err , detailBuffVipEye){	
						return res.json( {code : 200 , data : detailBuffVipEye } );
					})
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );

		})
});

router.delete('/delete/:id', function(req, res, next) {
		let idVipEye = parseInt(req.params.id);
		controllerBuffVipEye.handleDelete( idVipEye ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
			}
		})
});

router.get('/detail-order', function(req, res, next) {
		controllerBuffVipEye.getDetailOrder(function(err , detailOrder){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Order Not Found'} } );
			} else {
				return res.json( {code : 200 , data : detailOrder } );
			}
		})
});

module.exports = router;
