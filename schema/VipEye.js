var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var VipEyeSchema =  mongoose.Schema({
    video_id         	:   { type: String, required: true },
    name         	    :   { type: String, required: true },
    price_one_eye       :   { type: Number, required: true },
    total_price_pay     :   { type: Number, required: true },
    time_type           :   { type: Number },  // 0 là delay 1 là time buff done
    time_value          :   { type: Number },
    note         		:   { type: String, default : 'Description'},
    status              :   { type: Number, default : 0 },
    view_max            :   { type: Number },
    time_create         :   { type: Number},
    time_done           :   { type: Number, default : 0 },
    time_update         :   { type: Number, default : 0 },
    last_time_check     :   { type: Number, default : 0 },
});

AdminSchema.plugin(AutoIncrement, {inc_field: 'idVipEye'});

module.exports = mongoose.model('vip_eye', VipEyeSchema);
