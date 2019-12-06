const modalBuffLike = require('../../schema/FVI/BuffLike.js');
let BuffLikeController = {
	handleCreate(data , cb ) {
		let api = new modalBuffLike(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getOrderBuffLike( cb ) {
		const conditions = { status : 0 };
		const update    = { status : 1 };
		modalBuffLike.findOneAndUpdate( conditions, update  ,  { upsert: false }  , function(err , success) { 
			if ( success == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , success )
		});
	},

	getListBuffLikeAll( _limit , page ,  cb ) {
		modalBuffLike.find({})
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
    		.sort({time_create : - 1 })
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
	handleUpdate( id  , data , status = true ,cb ) {
		let conditions;
		if ( status == false ) {
			conditions = { video_id : id };
		} else {
			conditions = { idLike : id };
		}
		
		const update     = data;
		modalBuffLike.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  , function(err , updateSuccess) { 
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