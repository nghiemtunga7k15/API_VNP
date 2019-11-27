var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var BuffEyeSchema =  mongoose.Schema({
    status              :   { type: Number, default : 0 },
    process_id          :   { type: Number, default : 0 },     
    note         		:   { type: String, default : 'Description'},
    last_time_check     :   { type: Number, default : 0 },
    time_create         :   { type: Number},
    video_id         	:   { type: String, required: true },
    time_buff         	:  	{ type: Number, required: true },
    // eye_num         	:   { type: Number, required: true },
    view         	    :   { type: Number, required: true },
    price         	    :   { type: Number, required: true },
    total_price_pay     :   { type: Number, required: true },
    time_done           :   { type: Number, default : 0 },
    time_delay          :   { type: Number, default : 0 },
    time_buff_eye_done  :   { type: Number, default : 0 },
    time_update         :   { type: Number, default : 0 },
});

BuffEyeSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('buff-eye', BuffEyeSchema);
