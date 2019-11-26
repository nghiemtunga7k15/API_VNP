var express = require('express');
var router = express.Router();
const apiVideoCmts = require('../controller/apiVideoCmts.js');

const SchemaFbUser = require('../Schema/fb_user.js');

router.post('/add', function(req, res, next) {
	let data = { 
		video_id   :		req.body.video_id ,
		delays     :		req.body.delays ,
		time_create: 		new Date().getTime() ,
		comments   : 		req.body.comments ,	
		comments_count   : 		req.body.comments_count ,	
	}
	apiVideoCmts.handleAddVideoCmts(data, function (err , api) {
		if(err)  {
			return res.json( {code : 404 , data : { msg : 'Not Add'} } );
		} else { 
			let numberCmts = parseInt(api.comments_count);
			SchemaFbUser.find({status : 1 })
				.limit(numberCmts)
				.select('user_id fb_dtsg cookie')
				.exec(function(err, cookies){
					if (err) {
						return res.json( {code : 404 , data : { msg : 'Data Not Found'} } );
					} else {
						apiVideoCmts.handleGetUpdateVideoCmts( parseInt(api.idVideo) , function (err , updateSucess){		
							return res.json( {
								code : 200 , 
								data : api , 
								cookie : cookies
							} );
						});
		   				
					}
			})
		}
	})
});


module.exports = router;
