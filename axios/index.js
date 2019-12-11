const axios = require('axios');
module.exports = {
    ApiGetPhone: function(string) {
    	return new Promise(function(resolve, reject){
	     	axios.get('http://hacklike.biz/danhbafacebook/get/get_info1.php', {
			  params: {
			    uid: string
			  }
			})
			.then(function (response) {
				return resolve(response.data.phone )
			})
			.catch(function (error) {
				return reject(error)
			})
    	})
    }
}