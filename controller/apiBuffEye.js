const ApiBuffEye = require('../Schema/api_buff_eye.js');
let ApiController = {
	handleAddBuffEye(data , cb ) {
		let api = new ApiBuffEye(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	handleGetListBuffEye( _limit , page ,  cb ) {
		ApiBuffEye.find({})
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
			.exec(function(err, listBuffEye){
				if (err) return cb(err ,null);
        	return cb(null , listBuffEye )
		});
	},
	handleGetDetailBuffEye( id ,cb ) {
		ApiBuffEye.findOne({id : id}, function(err , detailBuffEye) { 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleGetUpdateBuffEye( id  , data ,cb ) {
		const conditions = {id : id};
		const update     = data;
		ApiBuffEye.findOneAndUpdate( conditions, update , function(err , detailBuffEye) { 
			if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleDeleteBuffEye( id   ,cb ) {
		ApiBuffEye.findOneAndRemove( {id : id}, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}
}
module.exports = ApiController ;