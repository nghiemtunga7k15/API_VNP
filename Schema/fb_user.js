var mongoose = require('mongoose');

var apiSchema =  mongoose.Schema({
    user_id             :  	{ type: String, default : '' },
    user_agent          :   { type: String, default : '' },     
    fb_dtsg             :   { type: String, default : '' },     
    status              :   { type: Number, default : 0 },
    note         		:   { type: String, default : 'Description'},
    last_time_use       :   { type: Number},
    last_time_check     :   { type: Number},
    time_create         :   { type: Number},
    cookie              :   { type: String},
    
});


module.exports = mongoose.model('fb_users', apiSchema);
