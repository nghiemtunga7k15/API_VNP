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
		let text = req.query.text ? req.query.text : '1212';
		let timeStart = req.query.time_start ? req.query.time_start : '' ;
		let timeEnd = req.query.time_end ? req.query.time_end : '';

		controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailOrderScanCmt){
			if(err)  {
				return res.json( {code : 404 , data : [] } );
			} else {  		
					// Time Start
					let  myDateTimeStart=timeStart.split("-");
					let newDateTimeStart =myDateTimeStart[1]+"/"+myDateTimeStart[2]+"/"+myDateTimeStart[0];
					timeStart = new Date(newDateTimeStart).getTime()

					// Time End
					let myDateTimeEnd=timeEnd.split("-");
					var newDateTimeEnd=myDateTimeEnd[1]+"/"+myDateTimeEnd[2]+"/"+myDateTimeEnd[0];
					timeEnd = new Date(newDateTimeEnd).getTime();				

					let result=[];
					if (  detailOrderScanCmt ) {
						detailOrderScanCmt.content.forEach(obj=>{
							let time_curent  = obj.created_time.toString().slice(0, 10);
							myDate=time_curent.split("-");
							var newDate=myDate[1]+"/"+myDate[2]+"/"+myDate[0];
							time_curent = new Date(newDate).getTime();	

							/*Full field*/
							if ( req.query.text &&  req.query.time_start && req.query.time_end )  {
								if ( parseInt(time_curent) > parseInt(timeStart ) && parseInt(time_curent) < parseInt(timeEnd) && obj.message.includes(text) == true  ) {
									result.push(obj)
								}

							/*Time Start and Time End*/
							}else if (req.query.time_start && req.query.time_end) {
								if ( parseInt(time_curent) > parseInt(timeStart ) && parseInt(time_curent) < parseInt(timeEnd) ) {
									result.push(obj)
							}
							/*Key Word*/
							} else if ( req.query.text ) {
								if (  obj.message.includes(text) == true ) {
									result.push(obj);
								}
							}else{
								result = detailOrderScanCmt;
							}
						})
						let post        = detailOrderScanCmt.content.length;
						let fanpageName = detailOrderScanCmt.name_fanpage;
						
						return res.json( 
							{
								code : 200 , 
								data : { result : result  , post : post , fanpageName:   fanpageName },
							});
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
			PromiseDetailScanCmt(idScanCmt).then(dataPromise=>{
				let time_log_data = req.body.update_log ? dataPromise : dataPromise;
 				data.log_time = time_log_data;
				controllerScanComment.handleUpdateScantCmt(idScanCmt , data , function(err , updateSuccess) {
					if(err)  {
						return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
					} else {

						return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
					}
				})
			})
			.catch(err=>{
				return res.json( {code : 404 , data : { msg : 'ID Error'} } );

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

router.put('/update/:id',  function(req, res, next) {
		let fb_id = req.params.id.toString();
		let promise  = controllerScanComment.getDetailScanCmtPromise(fb_id)
		let data  = {}
		let arrContent = [];
		let jsonData = JSON.stringify(req.body);
		let arrData = JSON.parse(jsonData);
		if(!req.body) {
			arrData = [];
		}
		promise.then(dataArr=>{
			if (Array.isArray(dataArr[0].content) == true) {
				arrContent = dataArr[0].content.concat(arrData);
			}else{
				arrContent      = arrData ;
			}
			let promise = [];
			let matching;
			arrContent.forEach(obj=>{
				obj["address_post"]         = {
					add_full     : '',
					add_county   : '',
					add_district : ''
				};
				obj["address_comment"]      = null;
			})
				data.content = arrContent;
				data.time_update = new Date().getTime() ;
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
			 					.catch(err=>{
									return res.json( {code : 200 , data : { msg : 'Err' } } );
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
						 			.catch(err=>{
										return res.json( {code : 200 , data : { msg : 'Err' } } );
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

router.get('/list-phone', function(req, res, next) {  
		let conditions = { $or : [ { 'last_time' :0 }  ]};
		let query      = modalScanComment.findOne( conditions );
		query
			.exec(function(err, detailOrder){
				if(err) {
					return res.json( {code : 404 , data : { msg : 'Err'} } );
				}else{
					let arr = [];
					if (detailOrder == null || detailOrder.length == 0) {
						return res.json( {code : 200 , data : [] } );
					}
					detailOrder.content.forEach((obj,idx)=>{
						let  object = {};
						if( obj.user_phone != 'Not Found') {
							object['id'] = obj.user_id;
							object['phone'] = obj.user_phone;
							object['idx'] = idx;
							arr.push(object);
						}
					})
					return res.json( {code : 200 , id : detailOrder.idScanCmt ,  data : arr } );
				}
			})	
});
 

router.put('/update-comment-post/:id', function(req, res, next) {
		let idScanCmt = parseInt(req.params.id);
		let dataArr;
		let date_now   = Date.now();
		let data = {};
		if( Array.isArray(req.body) == true) {
		 	dataArr = JSON.stringify(req.body);
			dataArr = JSON.parse(dataArr);
		}else{
			dataArr = [];
		}
		controllerScanComment.getDetailScanCmt( idScanCmt ,function ( err , detailOrderScanCmt){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Thất Bại'} } );
			}else{
				if (detailOrderScanCmt == null || !detailOrderScanCmt){
					return res.json( {code : 404 , data : [] } );
				}
				let arr = detailOrderScanCmt.content;
				function updateArray( array, index, _add_full , _add_county , _add_district , _phone ){
					if (arr[index] && array[index].address_post ) {
						console.log('Cosssssssssssssssssss')
						array[index].address_post.add_full = _add_full;
						array[index].address_post.add_county = _add_county;
						array[index].address_post.add_district = _add_district;
						array[index].user_phone = _phone;
					}
					return array;
				}

					if (dataArr.length !=0 ) {
						dataArr.forEach(obj=>{
							arr = updateArray( arr, parseInt(obj.idex) , 
							 	obj.address        ? obj.address  : '' , 
							 	obj.province.name  ? obj.province.name  : '',
							 	obj.district.name  ? obj.district.name  : '',
							 	obj.phone          ? obj.phone  : '',
							);
						})
					}

					data.content   = arr;
					data.last_time =  date_now ;

					console.log(arr);


					console.log(data)
					controllerScanComment.handleUpdateScantCmt(idScanCmt , data , function(err , updateSuccess) {
						if(err)  {
						} else {
							return res.json( {code : 200 , data : { msg : 'Thành Công'} } );
						}
					})
			}
		})
});

module.exports = router;
