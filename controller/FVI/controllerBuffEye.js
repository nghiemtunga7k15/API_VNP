const modalBuffEye = require('../../schema/FVI/BuffEye.js');
let BuffEyeController = {
	handleCreate(data , cb ) {
		let api = new modalBuffEye(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getListBuffEye( _limit , page , status  , sort_name , sort_value ,  cb ) {
			
		let sort_where_name  =  sort_name ? sort_name : "time_create";
		let sort_where_value =  sort_value && parseInt(sort_value) == 1  ? 1 :  -1 ;
		let query  =  status ?  modalBuffEye.find({status : status})  : modalBuffEye.find({});
			
			query
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
    		.sort([[sort_where_name ,sort_where_value]] )
			.exec(function(err, listBuffEye){
				if (err) return cb(err ,null);
        	return cb(null , listBuffEye )
		});
	},
	getOrderBuffEye( cb ) {
		let query  = { status : 0 } ;  
		let update = { status : 1 } ;  
		modalBuffEye.findOneAndUpdate( query , update , { upsert:false }, function(err, detailBuffEye){
		    if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
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
		modalBuffEye.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  ,  function(err , detailBuffEye) { 
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