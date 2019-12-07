const axios = require('axios');
module.exports = {
    ApiGetPhone: function(string , cb) {
    	axios.get('http://hacklike.biz/danhbafacebook/get/get_info1.php', {
		  params: {
		    uid: string
		  }
		})
		.then(function (response) {
			return cb(null , response.data.phone )
		})
		.catch(function (error) {
			return cb(error , null )
		})
    }
}