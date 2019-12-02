var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var VipEyeSchema =  mongoose.Schema({
    fb_id         	    :   { type: String, required: true },
    name         	    :   { type: String, required: true },
    choose_option_eye          :   { type: Number, required: true },
    time_vip_eye        :   { type: Number, required: true },
    total_price_pay     :   { type: Number }, 
    note         		:   { type: String, default : 'Description'},
    status              :   { type: Number, default : 0 },
    time_expired        :   { type: Number},
    time_update         :   { type: Number, default : 0 },
});

VipEyeSchema.plugin(AutoIncrement, {inc_field: 'idVipEye'});

module.exports = mongoose.model('vip_eye', VipEyeSchema);
