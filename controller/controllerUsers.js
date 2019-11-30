const modalUsers = require('../schema/FaceBookUser.js');
let UsersController = {
	getListUser(  cb ) {
		modalUsers.find({})
			.sort( { time_create : -1 } )
			.exec(function(err, listSetup){
				if (err) return cb(err ,null);
        	return cb(null , listSetup )
		});
	},
	handleCreate(data , cb ) {
		let api = new modalUsers(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	handleUpdate( idUser  , data ,cb ) {
		const conditions = {idUser : idUser};
		const update     = data;
		modalUsers.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  , function(err , updateSuccess) { 
			if ( updateSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , updateSuccess )
		});
	},
	handleDelete( idUser   ,cb ) {
		modalUsers.findOneAndRemove( {idUser : idUser}, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}
}
module.exports = UsersController ;