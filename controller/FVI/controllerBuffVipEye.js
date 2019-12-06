const modalBuffVipEye = require('../../schema/FVI/VipEye.js');
let BuffVipEyeController = {
	handleCreate(data , cb ) {
		let api = new modalBuffVipEye(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	getListBuffEye( _limit , page , status  , sort_name , sort_value ,  cb ) {
			
		let sort_where_name  =  sort_name ? sort_name : "time_create";
		let sort_where_value =  sort_value && parseInt(sort_value) == 1  ? 1 :  -1 ;
		let query  =  status ?  modalBuffVipEye.find({status : status})  : modalBuffVipEye.find({});
			
			query
			.limit(_limit)
    		.skip((_limit * page ) - _limit)
    		.sort([[sort_where_name ,sort_where_value]] )
			.exec(function(err, listBuffEye){
				if (err) return cb(err ,null);
        	return cb(null , listBuffEye )
		});
	},
	getDetailBuffVipEye( _idVipEye ,cb ) {
		modalBuffVipEye.findOne( { idVipEye : _idVipEye }, function(err , detailBuffEye) { 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleUpdateBuffVipEye( _idVipEye  , data ,cb ) {
		const conditions = { idVipEye : _idVipEye };
		const update     = data;
		modalBuffVipEye.findOneAndUpdate( conditions, { $set: update  } ,  { upsert: false }  ,  function(err , detailBuffEye) { 
			if ( detailBuffEye == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , detailBuffEye )
		});
	},
	handleDelete( _idVipEye   ,cb ) {
		modalBuffVipEye.findOneAndRemove( { idVipEye :  _idVipEye }, function(err , deleteSuccess) { 
			if ( deleteSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , deleteSuccess )
		});
	}
}
module.exports = BuffVipEyeController ;