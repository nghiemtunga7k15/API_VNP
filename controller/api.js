const API = require('../Schema/api.js');
let ApiController = {
	handleAddBuffEye(data , cb ) {
		let api = new API(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	handleGetListBuffEye( cb ) {
		API.find({}, function (err, listBuffEye) {
			if (err) return cb(err ,null);
        	return cb(null , listBuffEye )
    	});
	},
	handleGetDetailBuffEye( id ,cb ) {
		API.findOne({time_create: id}, function(err , detailBuffEye) { 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleGetUpdateBuffEye( id  , data ,cb ) {
		const conditions = {time_create: id};
		const update     = data;
		API.findOneAndUpdate( conditions, update , function(err , detailBuffEye) { 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleDeleteBuffEye( id   ,cb ) {
		API.findOneAndRemove( {time_create: id}, function(err , deleteSuccess) { 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}
}
module.exports = ApiController ;