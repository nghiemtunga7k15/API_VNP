var express = require('express');
var router = express.Router();
const modalFbUser = require('../schema/FaceBookUser.js');
const controllerUser = require('../controller/controllerUsers.js');

/* GET users listing. */
router.get('/get-cookie', function(req, res, next) {
  modalFbUser.find( {status : 1} )	
			.select('user_id fb_dtsg cookie')
			.exec(function(err, data){
				if (err) {
					return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
				} else {
					return res.json( {
						code : 200 , 
						data : data , 
					} );
	   				
				}
	})
});

router.get('/die', function(req, res, next) {
  modalFbUser.find({note : 'Cookie not working' })
			.exec(function(err, data){
				if (err) {
					return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
				} else {
					return res.json( {
						code : 200 , 
						data : data , 
					} );
	   				
				}
	})
});

router.get('/list', function(req, res, next) {
  controllerUser.getListUser(function (err ,  listUser) {
  		if ( err ) 	return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
  		return res.json( {
						code : 200 , 
						data : listUser , 
		} );
  })
});

router.post('/create', function(req, res, next) {
	let data = { 
			user_id             : 		req.body.user_id ,	
			user_agent          :		req.body.user_agent ,               
			fb_dtsg             : 		req.body.fb_dtsg ,
			status              : 		req.body.status ,	
			note                : 		req.body.note ,	
			last_time_use       : 		req.body.last_time_use ,	
			last_time_check     :       req.body.last_time_check, 
			time_create         :       new Date().getTime(),
			cookie              : 		req.body.cookie ,
				
		}
	controllerUser.handleCreate( data , function (err ,  listUser) {
	  		if ( err ) 	return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
	  		return res.json( {
							code : 200 , 
							data : listUser , 
			} );
	})
});

router.put('/update/:id', function(req, res, next) {
		let idUser = parseInt(req.params.id);
		let data = req.body;
		controllerUser.handleUpdate( idUser , data ,function ( err , updateSuccess){
				if(err)  {
					return res.json( {code : 404 , data : { msg : 'Not Update'} } );
				} else {
					return res.json( {code : 200 , data : { msg : 'Update Success'} } );
				}
			})
	
});

router.delete('/delete/:id', function(req, res, next) {
		let idUser = parseInt(req.params.id);
		controllerUser.handleDelete( idUser ,function ( err , updateSuccess){
			if(err)  {
				return res.json( {code : 404 , data : { msg : 'Not Delete'} } );
			} else {
				return res.json( {code : 200 , data : { msg : 'Delete Success'} } );
			}
		})
});


module.exports = router;
