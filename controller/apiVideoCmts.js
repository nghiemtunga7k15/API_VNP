const ApiVideoCmts = require('../Schema/api_video_cmt.js');
let ApiController = {
	handleAddVideoCmts(data , cb ) {
		let api = new ApiVideoCmts(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},

	handleGetUpdateVideoCmts( idVideo ,cb ) {
		const conditions = { idVideo : idVideo };
		ApiVideoCmts.findOneAndUpdate( conditions, { status : 1 } , function(err , detailBuffEye) { 
			if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},

}
module.exports = ApiController ;