var express = require('express');
var router = express.Router();
var moment = require('moment');

/*CONTROLLER*/
const controllerBuffVipEye = require('../controller/controllerBuffVipEye.js');
const controllerAdmin = require('../controller/controllerAdmin.js');

/*MODAL*/
const modalBuffVipEye = require('../schema/VipEye.js');


router.post('/create', function(req, res, next) {
	let promise  =  controllerAdmin.getAdminSetup();
	promise.then(success=>{
		let timeOneDay  = 60 * 60 * 24 * 1000;
		let day  = moment(new Date().getTime()).format('DD-MM-YYYY');
		let dayExpired  = moment(new Date().getTime() + parseInt(req.body.time_vip_eye) * timeOneDay).format('DD-MM-YYYY');
		let price = parseInt(success[0].price_vip_eye);
		let data = { 
			fb_id              : 		req.body.fb_id 	,
			name               :		req.body.name,
			choose_option_eye  :		req.body.choose_option_eye,
			time_vip_eye       :		req.body.time_vip_eye,
			total_price_pay    :		req.body.choose_option_eye * price,
			note               : 		req.body.note,
			status             : 		req.body.status,
			time_create        : 		day,
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
			return res.json( {code : 404 , data : { msg : 'Not Found'} } );
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
				return res.json( {code : 404 , data : { msg : 'Not Found'} } );
			} else {
				modalBuffVipEye.count({}, function( err, totalRecord){
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
		let idVipEye = parseInt(req.params.id);
		controllerBuffVipEye.getDetailBuffVipEye( idVipEye ,function ( err , detailBuffEye){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Get Detail'} } );
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

			controllerBuffVipEye.handleUpdateBuffVipEye( idVipEye , req.body ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Not Update'} } );
				} else {
					controllerBuffVipEye.getDetailBuffVipEye( idVipEye ,function ( err , detailBuffVipEye){	
						return res.json( {code : 200 , data : detailBuffVipEye } );
					})
				}
			})
		})
		.catch(e=>{
				return res.json( {code : 404 , data : { msg : 'Not Add'} } );

		})
});

router.delete('/delete/:id', function(req, res, next) {
		let idVipEye = parseInt(req.params.id);
		controllerBuffVipEye.handleDelete( idVipEye ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Delete'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Delete Success'} } );
			}
		})
});

module.exports = router;
