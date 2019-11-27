var express = require('express');
var router = express.Router();
/*CONTROLLER*/
const controllerAdmin = require('../controller/controllerAdmin.js');
/*MODAL*/
const modalAdmin = require('../schema/AdminSetup.js');

/* CREATE. */
router.post('/create', function(req, res, next) {
	let data = { 
		price_one_eye               :		req.body.price_one_eye ,
		view_max                    :		req.body.view_max ,
		price_comment_randum        :		req.body.price_comment_randum ,
		price_comment_choose        :		req.body.price_comment_choose ,
		comment_max                 :		req.body.comment_max ,
		time_create     			: 		new Date().getTime() ,
		time_update     			: 		req.body.time_update ,	
	}
	controllerAdmin.handleCreate(data, function (err , api) {
		if(err)  {
			return res.json( {code : 404 , data : { msg : 'Not Add'} } );
		} else { 
			return res.json( {code : 404 , data : api } );
		}
	})
});

/* GET */

router.get('/list', function(req, res, next) {
		controllerAdmin.getListSetup(  function ( err , list){
			if(err) {
				return res.json( {code : 404 , data : { msg : 'Not Get List'} } );
			} else{
						return res.json( {code : 200 , data : list } );
			}
		})
});

module.exports = router;
