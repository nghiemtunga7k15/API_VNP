var express = require('express');
var router = express.Router();
var moment = require('moment');
var fs = require('fs');
const axios = require('axios');

/*CONTROLLER*/
const controllerScanComment = require('../../controller/ST/controllerScanComment.js');
const controllerAdmin = require('../../controller/controllerAdmin.js');

/*MODAL*/
const modalScanComment = require('../../schema/ST/ScanComment.js');

/*TOOL*/
const tool = require('../../tool');

/*Axios*/
const axiosAPI = require('../../axios')

router.post('/create', async function(req, res, next) {
	let id_post = tool.convertUrlToID(req.body.fb_id);
	if (!id_post) {
		return res.json( {code : 404 , data : { msg : 'Thất Bại' , err : 'ID Sai' } } );
	}
	try {
	   const response = await axios.get(`https://graph.facebook.com/${id_post}?access_token=EAAGNO4a7r2wBAB8XHEoc5xklAq4q2OTZCzW2rfAyt5OhJmp5xLS3PZC6z0qlzZBiAntZAub0PSUwQKon0gOqPqlCYIOqNCiheeFeqIEwDI37yjMsLVhbVT1SzTQPDPEXhRQyOqU5vaokjLii0WlhgO7LHmZAfH4CykeHDi4Y8wgZDZD`);
	   	    if ( response && response.data.from ) {
				let promise  =  controllerAdmin.getAdminSetup();
				promise.then(success=>{
					let timeOneDay  = 60 * 60 * 24 * 1000;
					let minutesOnDay = 60 * 24;
					let data = { 
						fb_id              : 		id_post	,
						minutes            :        (parseInt(req.body.time) *minutesOnDay).toString(),
						time_create        :		new Date().getTime(),
						time_expired       :        new Date().getTime() + parseInt(req.body.time) * timeOneDay
					}

					let list_combo = success[0].list_combo_scan_cmt;
					// Matching Combo
					if (list_combo.length > 0 ) {
						combo_matching = list_combo.filter(function (combo) {
							return combo.name == req.body.type_order.toString().toUpperCase() ;
						});
							
						data.type_order =  {
							name          : combo_matching[0].name,
							limit_post    : combo_matching[0].limit_post,
							price_pay_buy : combo_matching[0].price_pay_buy,
							price_pay_cmt : combo_matching[0].price_pay_cmt,
						}	
					}

					controllerScanComment.handleCreate(data, function (err , api) {
						if(err)  {
							return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
						} else { 
							let html =  `<table style="width:100%" cellpadding="10"  rules="all">
										<thead>
										    <tr>
										      <th>STT</th>
										      <th>UserID</th>
										      <th>FacebookName</th>
										      <th>Giới tính</th>
										      <th>Email</th>
										      <th>SDT</th>
										      <th>Dia chi</th>
										      <th>Thời gian Comment</th>
										      <th>Nội dung Comment</th>
										    </tr>
										</thead>
										<tbody>
										</tbody>
										</table>`;
							fs.writeFile(`public/file/${id_post}_${api.idScanCmt}.html`, html , function(err){
									            if (err) return console.log(err);
							}); 
							return res.json( {code : 200 , data : api } );
						}
					})
				})
				.catch(e=>{
						return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
				})
		    }else{
				return res.json( {code : 404 , data : { msg : 'Thất Bại' , err : 'ID Không Tồn Tại' } } );
		    }

	} catch (error) {
	  	return res.json( {code : 404 , data : { msg : 'Thất Bại' , err : 'ID Không Tồn Tại' } } );	  
	}
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
		controllerScanComment.getListOrder( _limit , page ,  function ( err , listBuffEye){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				modalScanComment.count({}, function( err, totalRecord){
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
		let idScanCmt = parseInt(req.params.id);
		controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailOrderScanCmt){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {
				return res.json( {code : 200 , data : detailOrderScanCmt } );
			}
		})
});

router.put('/update-status/:id', function(req, res, next) {
		let idScanCmt = parseInt(req.params.id);
		let promise  =  controllerAdmin.getAdminSetup();
		promise.then(success=>{
			let price = parseInt(success[0].price_scan_cmt);
			let data = req.body;
			
			data.time_update = new Date().getTime();

			controllerScanComment.handleUpdateScanCmt( idScanCmt , req.body ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : [] } );
				} else {
					controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailBuffVipEye){	
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
		let idScanCmt = parseInt(req.params.id);
		controllerScanComment.handleDelete( idScanCmt ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
			}
		})
});

router.put('/update/:id', function(req, res, next) {
		let fb_id = req.params.id.toString();
		let promise  = controllerScanComment.getDetailScanCmtPromise(fb_id)
		let data  = {}
		let arrContent = [];
		let jsonData = JSON.stringify(req.body);
		let arrData = JSON.parse(jsonData);
		data.time_update = new Date().getTime() ;
		promise.then(obj=>{
			if ( !obj || obj == null ) {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			}
			if ( Array.isArray(arrData) ==  true &&  Array.isArray(obj.content) ==  true ) {
				arrContent = obj.content.concat(arrData);
				data.content      = arrContent ;
			}else { 
				arrContent = arrData;
				data.content      = arrContent ;
			}
			controllerScanComment.handleUpdateByFaceId( fb_id  , data  ,function ( err , updateSuccess){
					if(err)  {
						return res.json( {code : 404 , data : [] } );
					} else {
							/*--------OPEN TABLE HTML------------*/
							let header =  `<table style="width:100%" cellpadding="10"  rules="all">
							  <thead>
							    <tr>
							      <th>STT</th>
							      <th>UserID</th>
							      <th>FacebookName</th>
							      <th>Giới tính</th>
							      <th>Email</th>
							      <th>SDT</th>
							      <th>Dia chi</th>
							      <th>Thời gian Comment</th>
							      <th>Nội dung Comment</th>
							    </tr>
							  </thead>
							  <tbody>`;
							 /*----------MAIN TABLE-----------*/
							let main = '';
							/*----------FOOTER TABLE-----------*/
							let footer =`</tbody>
							</table>
							`;
							let num = 1;
							if  ( Array.isArray(arrContent) ==  true ) {
								arrContent.forEach(comment=>{
									// axios.ApiGetPhone(comment.user_id , function(err , phone ){
										if( parseInt(num) < 10 ){
											num = `0${num}` 
										}
										// if ( !phone || phone == 'undefined') {
										// 	phone = null;
										// }
										let time = 	comment.created_time.toString().slice(0,10)
										let content  = `
										 <tr>
									      <td>${num}</td>
									      <td>${comment.user_id}</td>
									      <td>${comment.user_name}</td>
									      <td>Nam</td>
									      <td>email@gmail.com</td>
									      <td>Phone</td>
									      <td>Địa Chỉ</td>
									      <td>${time}</td>
									      <td>${comment.message}</td>
									    </tr>`;
									    main = `${main}${content}`;
										num = parseInt(num) +1;
									// });
								});
								let htmlTable = `${header}${main}${footer}`;
								fs.writeFile(`public/file/${fb_id}_${updateSuccess.idScanCmt}.html`, htmlTable, function(err){
						            if (err) return console.log(err);
						        });  
							}
							return res.json( {code : 200 , data : { msg: 'Thành Công' } } );
					}
			})

		})
		
});

router.get('/detail-order', function(req, res, next) {
		let query  = { status : 0 } ;  
		let update = { status : 1 } ;  
		modalScanComment.findOneAndUpdate( query , update , { upsert:false }, function(err, detailBuffCmt){
		 			if  ( detailBuffCmt ) {
		 				if (err) {
		 					return res.json( {code : 404 , data : [] } );	
			 			} else {
			 				return res.json( {code : 200 , data : { post_id : detailBuffCmt.fb_id } } );
			 			}
		 			} else {
		 					return res.json( {code : 404 , data : { msg : 'Order Not Found' } } );	
		 			}
		}); 

});
module.exports = router;
