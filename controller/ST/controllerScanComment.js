const modalScanComment = require('../../schema/ST/ScanComment.js');
let ScanCommentController = {
	handleCreate(data , cb ) {
		let api = new modalScanComment(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getListOrder( _limit , page ,  cb ) {	
		let query  =  modalScanComment.find({});
			query
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
    		.sort({time_create : - 1 })
			.exec(function(err, listOrderScanCmt){
				if (err) return cb(err ,null);
        	return cb(null , listOrderScanCmt )
		});
	},
	getDetailScanCmt( idScanCmt ,cb ) {
		modalScanComment.findOne( { idScanCmt : idScanCmt }, function(err , detailScanCmt) { 
			if (err) return cb(err ,null);
        	return cb(null , detailScanCmt )
		});
	},
	handleUpdateScantCmt( idScanCmt  , data ,cb ) {
		const conditions = { idScanCmt : idScanCmt };
		const update     = data;
		modalScanComment.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  ,  function(err , detailScanCmt) { 
			if ( detailScanCmt == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailScanCmt )
		});
	},
	handleDelete( idScanCmt   ,cb ) {
		let update = { status : 3 } ;  
		let query  = { idScanCmt : parseInt(idScanCmt) } ;  
		modalScanComment.findOneAndUpdate( query , update , { upsert:false } , function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
		// modalScanComment.findOneAndRemove( {idScanCmt : idScanCmt}, function(err , deleteSuccess) { 
		// 	if ( deleteSuccess == null ) {
		// 		return cb(true ,null);
		// 	} 
		// 	if (err) return cb(err ,null);
  //       	return cb(null , deleteSuccess )
		// });
	},
	handleUpdateByFaceId( fb_id  , data ,cb ) {
		const conditions = { fb_id : fb_id };
		const update     = data;
		modalScanComment.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  ,  function(err , detailScanCmt) { 
			if ( detailScanCmt == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailScanCmt )
		});
	},
	getDetailScanCmtPromise( fb_id  ) {
		return new Promise(function(resolve, reject) { 
			modalScanComment.findOne( { fb_id : fb_id }, function(err , detailScanCmt) { 
				if (err) return reject(err);
	        	return resolve(detailScanCmt)
			});
		});
	},
	getListOrderDelete( ){
		return new Promise(function(resolve, reject) { 
			let query  =  modalScanComment.find({ status : 3 , time_stop : 0 });
				query
				.exec(function(err, listOrderScanCmt){
					if (err) return reject(err);
	        		return resolve(listOrderScanCmt)
			});
		});
	},
	handleUpdateMutil( ){
		let day_now = new Date().getTime();
			return new Promise(function(resolve, reject) { 
					let query  = { status : 3 , time_stop : 0 };  
					let update = { time_stop :  day_now } ;  
					modalScanComment.updateMany(query, update , { upsert:false } , function(err , updateSuccess ){
						if(err) {
							return reject(err);
						}else{
							return resolve(updateSuccess )
						}
					});
			});

	}
}
module.exports = ScanCommentController ;