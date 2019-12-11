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
	let id_post;
	if (req.body.fb_id) {
		id_post = tool.convertUrlToID(req.body.fb_id);
	}else{
		return res.json( {code : 404 , data : { err : 'Chưa điền ID' } } );
	}
	try {
	   const response = await axios.get(`https://graph.facebook.com/${id_post}?access_token=EAACW5Fg5N2IBACXGG8K3E2Hp6EXJRLaPRZApRQqmZBafGvzFpb3KU54AZBTqHZAWZCsn9AbJrVmt7aE0MBSg8uWY7cB8zcKZA9bfVoJr0K9jE5tj1NnQJZA0ZAkI82u3RfZAnMCV8zTSAZBL0SZBvxA3YfZCyD3uNZAEgZBCI08b9P2lng59p2O5DVccYN`);
	   	    if ( response && response.data.from ) {
	   	    	let name_page;
				let promise  =  controllerAdmin.getAdminSetup();
				promise.then(success=>{
					let timeOneDay  = 60 * 60 * 24 * 1000;
					let minutesOnDay = 60 * 24;
					if (response.data.from.name) {
						name_page = response.data.from.name;
					}
					let data = { 
						fb_id              : 		id_post	,
						name_fanpage       :        name_page,
						note               :        req.body.note,
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
						data.total_price_pay = combo_matching[0].price_pay_buy;
					}
					controllerScanComment.handleCreate(data, function (err , api) {
						if(err)  {
							return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
						} else { 
							// let html =  `<table style="width:100%" cellpadding="10"  rules="all">
							// 			<thead>
							// 			    <tr>
							// 			      <th>STT</th>
							// 			      <th>UserID</th>
							// 			      <th>FacebookName</th>
							// 			      <th>Giới tính</th>
							// 			      <th>Email</th>
							// 			      <th>SDT</th>
							// 			      <th>Dia chi</th>
							// 			      <th>Thời gian Comment</th>
							// 			      <th>Nội dung Comment</th>
							// 			    </tr>
							// 			</thead>
							// 			<tbody>
							// 			</tbody>
							// 			</table>`;
							// fs.writeFile(`public/file/${id_post}_${api.idScanCmt}.html`, html , function(err){
							// 		            if (err) return console.log(err);
							// }); 
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
		controllerScanComment.getListOrder( _limit , page ,  function ( err , listScanCmt){
			if(err) {
				return res.json( {code : 404 , data : [] } );
			} else {
				modalScanComment.count({}, function( err, totalRecord){
   					if ( err ) {
   						return res.json( {code : 404 , data : [] } );
   					} else {
						return res.json( {code : 200 , data : listScanCmt ,  page : page , limit : _limit , total : totalRecord } );
   					}
				})
			}
		})
});

router.get('/detail/:id', function(req, res, next) {
		let idScanCmt = parseInt(req.params.id);
		let text = req.query.text;
		let timeStart = req.query.time_start;
		let textEnd = req.query.time_end;
		controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailOrderScanCmt){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {  
					if ( timeStart && textEnd ) {			
						let time_start = `${timeStart}T00:00:00+0000`; 
						time_start=(time_start).toString().replace(/[^\d]/g,'').slice(0, -9);

						let time_end = `{${textEnd}T00:00:00+0000`;    
						time_end=(time_end).toString().replace(/[^\d]/g,'').slice(0, -9);
					}
					let result=[];
					// console.log(detailOrderScanCmt)
					// return;
					if (  detailOrderScanCmt ) {
						detailOrderScanCmt.content.forEach(obj=>{
							let time_curent = (obj.created_time).toString().replace(/[^\d]/g,'').slice(0, -9);

							// Full 
							if ( timeStart &&  textEnd &&  text ) {
								if (  parseInt(time_curent) < parseInt(time_end) &&   parseInt(time_curent) > parseInt(time_start) &&  (obj.message.includes(text) == true) ) {
									result.push(obj);
								}
							}
							// Time satrt and time and
							 if ( timeStart &&  textEnd )  {
								if (  parseInt(time_curent) < parseInt(time_end) &&   parseInt(time_curent) > parseInt(time_start) ) {
									result.push(obj);
								}
							}
							// Text
							 if ( text ) {
								if (  obj.message.includes(text) == true ) {
									result.push(obj);
								}
							}
							
						})
						if (result.length > 0) {
							var data = {
								result : result,
								fanpageName : detailOrderScanCmt.name_fanpage,
								post : detailOrderScanCmt.content.length
							}
						}
						return res.json( 
							{
								code : 200 , 
								data : { result : result.length > 0 ? data  :  detailOrderScanCmt },
							} );
					}else{
						return res.json( {code : 400 , data : [] } );
					}
			}
		})
});

router.put('/update-scan-cmt/:id', function(req, res, next) {
		let idScanCmt = parseInt(req.params.id);
		let data =  req.body;
		function PromiseDetailScanCmt(idScanCmt) {
			let arr = [];
			let obj = {};
			let time_curent = new Date().getTime();
			return new Promise(function(resolve, reject) { 
				controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailOrderScanCmt){
					if ( err || !detailOrderScanCmt || detailOrderScanCmt == null || detailOrderScanCmt == undefined ) {
						return reject(err);
					}else{
						obj.log_time   = time_curent;
						obj.total_post = detailOrderScanCmt.content.length;
						arr = detailOrderScanCmt.log_time;
						arr.push(obj);
						resolve(arr);
					}
				})
			})
		}
		if ( req.body.update_log ) {
			PromiseDetailScanCmt(idScanCmt).then(dataPromise=>{
				data.log_time = dataPromise;
				controllerScanComment.handleUpdateScantCmt(idScanCmt , data , function(err , updateSuccess) {
					if(err)  {
						return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
					} else {

						return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
					}
				})
			})
		} 
		
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
		promise.then(dataArr=>{
			if (Array.isArray(dataArr[0].content) == true && dataArr[0].content.length > 0) {
				arrContent = dataArr[0].content.concat(arrData);
				data.content      = arrContent ;
			}
			if (arrData.length > 0) {
				data.content      = arrData ;
			}
			controllerScanComment.handleUpdateByFaceId( fb_id  , data  ,function ( err , updateSuccess){
					if(err)  {
							return res.json( {code : 404 , data : [] } );
					} else {
							return res.json( {code : 200 , data : { msg: 'Thành Công' } } );
					}
			})
		})
		.catch(err=>{
			return res.json( {code : 404 , data : { msg: 'Thất Bại' } } );

		})	
});

router.get('/detail-order', function(req, res, next) {
		let query  = { status : 0 } ;  
		let update = { status : 1 } ;  
		function checkIsExistArr(arr) {
		  let isExist = (arr, x) => arr.includes(x);
		  let ans = [];

		  arr.forEach(element => {
		    if(!isExist(ans, element)) ans.push(element);
		  });

		  return ans;
		}
		let promise = controllerScanComment.getListOrderDelete();
		let arrIdDelete = [];
		let result;
		modalScanComment.findOneAndUpdate( query , update , { upsert:false }, function(err, detailBuffCmt){
			 			if  ( detailBuffCmt || detailBuffCmt != null ) {
			 				if (err) {
			 					return res.json( {code : 404 , data : [] } );	
			 				}else {
			 					promise.then(listOrderDelete=>{
			 						let arrIdDelete = [];
						 			if (listOrderDelete && listOrderDelete .length ) {
				 						listOrderDelete.forEach(order=>{
				 							arrIdDelete.push(order.fb_id);
				 						})
				 						let result = checkIsExistArr(arrIdDelete);
				 						let promise_update_mutil	 = controllerScanComment.handleUpdateMutil();
				 						promise_update_mutil.then(update=>{
											return res.json( {code : 200 , data :  { post_id : detailBuffCmt.fb_id  ,  stop_id : result } } );
				 						})
									}else{
										return res.json( {code : 200 , data :  { post_id : detailBuffCmt.fb_id  ,  stop_id : null } } );
									}	
			 					})
				 			}
				} else {
					promise.then(listOrderDelete=>{
						if (listOrderDelete && listOrderDelete .length > 0) {
							listOrderDelete.forEach(order=>{
				 				arrIdDelete.push(order.fb_id);
				 			})
				 			let result = checkIsExistArr(arrIdDelete);
				 			let promise_update_mutil	 = controllerScanComment.handleUpdateMutil();
				 			promise_update_mutil.then(update=>{
								return res.json( {code : 200 , data :  { post_id : null  ,  stop_id : result } } );
				 			})
						}else{
							return res.json( {code : 200 , data :  { post_id : null  ,  stop_id : null } } );
						}
					})
					.catch(err=>{
						return res.json( {code : 200 , data : { msg : 'Err' } } );
					})
			 	}
		})
			
});

module.exports = router;
