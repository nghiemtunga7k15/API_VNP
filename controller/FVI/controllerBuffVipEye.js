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
	handleUpdateBuffVipEye( _idVipEye ,  status = true , data ,cb ) {
		const conditions = { idVipEye : _idVipEye };
		const update     = data;
		if ( status == false ) {
			update.last_time_use =  new Date().getTime();
		}
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
	},
	getDetailOrder( cb ) {
		let data_now = Date.now();
		let conditions = { $or : [ { 'last_time_use' :0}  , {'last_time_use': {$gt : 1}  }] , "time_expired": { $gt : parseInt(data_now) }};
		let query  = modalBuffVipEye.findOne(conditions);
			query
			.limit(1)
			.sort({ last_time_use :  1 })
			.exec(function(err, detailOrder){
				if (err) return cb(err ,null);
        		return cb(null , detailOrder );
		});
	}

}
module.exports = BuffVipEyeController ;