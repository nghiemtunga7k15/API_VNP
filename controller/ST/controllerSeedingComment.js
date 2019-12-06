const modalSeedingComment = require('../../schema/ST//SeedingComment.js');
let SeedingCommentController = {
	handleCreate(data , cb ) {
		let api = new modalSeedingComment(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getListOrderSeedingComment( _limit , page ,  cb ) {
		let query  =  modalSeedingComment.find({});
			query
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
    		.sort({time_create : - 1 })
			.exec(function(err, data){
				if (err) return cb(err ,null);
        	return cb(null , data )
		});
	},
	getDetailSeedingComment( idSeedingCmt ,cb ) {
		modalSeedingComment.findOne( { idSeedingCmt : idSeedingCmt }, function(err , detailSeedingComment) { 
			if (err) return cb(err ,null);
        	return cb(null , detailSeedingComment )
		});
	},
	handleUpdateSeedingComment( idSeedingCmt  , data ,cb ) {
		const conditions = { idSeedingCmt : idSeedingCmt };
		const update     = data;
		modalSeedingComment.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  ,  function(err , detailBuffEye) { 
			if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleDelete( idSeedingCmt   ,cb ) {
		modalSeedingComment.findOneAndRemove( { idSeedingCmt :  idSeedingCmt }, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	},
	
}
module.exports = SeedingCommentController ;