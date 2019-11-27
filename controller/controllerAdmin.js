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
}
module.exports = BuffCommentController ;