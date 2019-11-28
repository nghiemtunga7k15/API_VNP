const modalBuffEye = require('../schema/BuffEye.js');
let BuffEyeController = {
	handleCreate(data , cb ) {
		let api = new modalBuffEye(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getListBuffEye( _limit , page , status  ,  cb ) {
		let query  =  status ?  modalBuffEye.find({status : status})  : modalBuffEye.find({});
		
			query
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
    		.sort({time_create : - 1 })
			.exec(function(err, listBuffEye){
				if (err) return cb(err ,null);
        	return cb(null , listBuffEye )
		});
	},
	getDetailBuffEye( id ,cb ) {
		modalBuffEye.findOne({id : id}, function(err , detailBuffEye) { 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleUpdateBuffEye( id  , data ,cb ) {
		const conditions = {id : id};
		const update     = data;
		modalBuffEye.findOneAndUpdate( conditions, update ,  { upsert: false }  ,  function(err , detailBuffEye) { 
			if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleDelete( id   ,cb ) {
		modalBuffEye.findOneAndRemove( {id : id}, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}
}
module.exports = BuffEyeController ;