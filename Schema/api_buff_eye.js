var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var ApiBuffEyeSchema =  mongoose.Schema({
    status              :   { type: Number, default : 0 },
    process_id          :   { type: Number, default : 0 },     
    note         		:   { type: String, default : 'Description'},
    last_time_check     :   { type: Number, default : 0 },
    time_create         :   { type: Number},
    video_id         	:   { type: Number, required: true },
    time_buff         	:  	{ type: Number, required: true },
    eye_num         	:   { type: Number, required: true },
});

ApiBuffEyeSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('api', ApiBuffEyeSchema);
