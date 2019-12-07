var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var VipEyeSchema =  mongoose.Schema({
    fb_id         	    :   { type: String, required: true },
    name         	    :   { type: String, required: true },
    choose_option_eye   :   { type: Number, required: true },
    time_vip_eye        :   { type: Number, required: true }, // Tính bằng ngày 
    total_price_pay     :   { type: Number }, 
    note         		:   { type: String, default : 'Description'},
    status              :   { type: Number, default : 0 },
    time_expired        :   { type: Number},
    time_done           :   { type: Number , default : 0},
    last_time_use       :   { type: Number , default : 0},
    time_create         :   { type: Number},
    time_update         :   { type: Number, default : 0 },
});

VipEyeSchema.plugin(AutoIncrement, {inc_field: 'idVipEye'});

module.exports = mongoose.model('buff_vip_eye', VipEyeSchema);
