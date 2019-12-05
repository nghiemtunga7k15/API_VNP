const modalBuffComment = require('../../schema/BuffComment.js');
let BuffCommentController = {
	handleCreate(data , cb ) {
		let api = new modalBuffComment(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getListBuffComment( _limit , page ,  cb ) {
		modalBuffComment.find()
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
    		.sort({time_create : - 1 })
			.exec(function(err, listCmts){
				if (err) return cb(err ,null);
        	return cb(null , listCmts )
		});
	},
	getOrderBuffComment( cb ) {
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
	handleUpdateBuffComment( idVideo ,cb ) {
		const conditions = { idVideo : idVideo };
		modalBuffComment.findOneAndUpdate( conditions, { status : 1 } ,  { upsert: false }  , function(err , detailBuffCmt) { 
			if ( detailBuffCmt == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffCmt )
		});
	},
	getDetailBuffComment( idVideo ,cb ) {
		modalBuffComment.findOne({idVideo : idVideo}, function(err , detailCmts) { 
			if (err) return cb(err ,null);
        	return cb(null , detailCmts )
		}); 
	},
	handleUpdate( id  , data , status = true ,cb ) {
		let conditions;
		if ( status == false ) {
			conditions = { video_id : id };
		} else {
			conditions = { idVideo : id };
		}
		const update     = data;
		modalBuffComment.findOneAndUpdate(  conditions , { $set: update } , { upsert: false } , function(err , updateSuccess) { 
			if ( updateSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , updateSuccess )
		});
	},
	handleDelete( idVideo   ,cb ) {
		modalBuffComment.findOneAndRemove( {idVideo : idVideo}, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}

}
module.exports = BuffCommentController ;