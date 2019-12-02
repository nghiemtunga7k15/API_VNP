var mongoose = require('mongoose');

const modalUsers = require('../schema/FaceBookUser.js');

function convertStringToObjectId(ids) {

    if (ids.constructor === Array) {
        return ids.map(mongoose.Types.ObjectId);
    }

    return mongoose.Types.ObjectId(ids);
}

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
	handleUpdate( _id  , data ,cb ) {
		let id = convertStringToObjectId(_id)
		const conditions = { _id : id };
		const update     = data;
		modalUsers.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  , function(err , updateSuccess) { 
			if ( updateSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , updateSuccess )
		});
	},
	handleDelete( _id   ,cb ) {
		let id = convertStringToObjectId(_id)
		modalUsers.findOneAndRemove( {_id : id}, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}
}
module.exports = UsersController ;