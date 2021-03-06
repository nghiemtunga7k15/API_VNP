var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var BuffEyeSchema =  mongoose.Schema({
    video_id         	:   { type: String, required: true },
    view         	    :   { type: Number, required: true },
    price_one_eye       :   { type: Number, required: true },
    total_price_pay     :   { type: Number, required: true },
    time_type           :   { type: String },  // 0 là delay 1 là time buff done
    time_value          :   { type: Number },
    id_vip              :   { type: String  , default : '' }, 
    note         		:   { type: String, default : 'Description'},
    status              :   { type: Number, default : 0 },
    view_max            :   { type: Number },
    time_create         :   { type: Number},
    time_done           :   { type: Number, default : 0 },
    time_update         :   { type: Number, default : 0 },
    last_time_check     :   { type: Number, default : 0 },
});
// BuffEyeSchema.index({'$**': 'text'});

BuffEyeSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('buff_eye', BuffEyeSchema);
