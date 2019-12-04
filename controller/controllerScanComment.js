const modalScanComment = require('../schema/ScanComment.js');
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
			.exec(function(err, listOrderScanCmt){
				if (err) return cb(err ,null);
        	return cb(null , listOrderScanCmt )
		});
	},
	getDetailScanCmt( idScanCmt ,cb ) {
		modalScanComment.findOne( { idScanCmt : idScanCmt }, function(err , detailBuffEye) { 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleUpdateScanCmt( idScanCmt  , data ,cb ) {
		const conditions = { idScanCmt : idScanCmt };
		const update     = data;
		modalScanComment.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  ,  function(err , detailBuffEye) { 
			if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleDelete( idScanCmt   ,cb ) {
		modalScanComment.findOneAndRemove( { idScanCmt :  idScanCmt }, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	},
	handleUpdateByFaceId( fb_id  , data ,cb ) {
		const conditions = { fb_id : fb_id };
		const update     = data;
		modalScanComment.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  ,  function(err , detailBuffEye) { 
			if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	getOrderScanComment( cb ) {
		let query  = { status : 0 } ;  
		let update = { status : 1 } ;  
		modalBuffComment.findOneAndUpdate( query , update , { upsert:false }, function(err, detailBuffCmt){
		    if ( detailBuffCmt == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffCmt )
		}); 
	},
}
module.exports = ScanCommentController ;