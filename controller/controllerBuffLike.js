const modalBuffLike = require('../schema/BuffLike.js');
let BuffLikeController = {
	handleCreate(data , cb ) {
		let api = new modalBuffLike(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getOrderBuffLike( cb ) {
		modalBuffLike.find({ status   : 0 })
			.limit(1)
			.exec(function(err, listCmts){
				if (err) return cb(err ,null);
        	return cb(null , listCmts )
		});
	},

	getListBuffLikeAll( _limit , page ,  cb ) {
		modalBuffLike.find({status   : 0 })
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
			.exec(function(err, listCmts){
				if (err) return cb(err ,null);
        	return cb(null , listCmts )
		});
	},
	getDetailBuffLike( idLike ,cb ) {
		modalBuffLike.findOne({idLike : idLike}, function(err , detailCmts) { 
			if (err) return cb(err ,null);
        	return cb(null , detailCmts )
		});
	},
	handleUpdateBuffLike( idLike ,cb ) {
		const conditions = { idLike : idLike };
		modalBuffLike.findOneAndUpdate( conditions, { status : 1 } , function(err , success) { 
			if ( success == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , success )
		});
	},
	handleUpdate( idLike  , data ,cb ) {
		const conditions = {idLike : idLike};
		const update     = data;
		modalBuffLike.findOneAndUpdate( conditions, update , { upsert: true, new: true } , function(err , updateSuccess) { 
			if ( updateSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , updateSuccess )
		});
	},
	handleDelete( idLike   ,cb ) {
		modalBuffLike.findOneAndRemove( {idLike : idLike}, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}

}
module.exports = BuffLikeController ;