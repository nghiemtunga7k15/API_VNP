const modalAdmin = require('../schema/AdminSetup.js');
let BuffCommentController = {
	handleCreate(data , cb ) {
		let api = new modalAdmin(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getListSetup(  cb ) {
		modalAdmin.find({})
			.limit(1)
			.exec(function(err, listSetup){
				if (err) return cb(err ,null);
        	return cb(null , listSetup )
		});
	},

	handleDelete( id_AdSetup   ,cb ) {
		modalAdmin.findOneAndRemove( {id_AdSetup : id_AdSetup}, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	},

	getAdminSetup() {
		let self = this;
		return new Promise(function(resolve, reject) { 
			self.getListSetup(function ( err , adminSetUp){
				if(err) return reject(err);
				return resolve(adminSetUp);
			})
		 });
	}


}
module.exports = BuffCommentController ;