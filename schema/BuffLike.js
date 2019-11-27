var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var BuffLikeSchema =  mongoose.Schema({
    video_id            :   { type: String , required: true },
    type_buff           : 	{ type: String , required: true },
    quantity            :   { type: String , required: true },     
    price               : 	{ type: Number , required: true },
    total_price_pay     :   { type: Number , required: true },     
    time_delay          :   { type: Number, default : 1 },
    time_buff_like_done :   { type: Number},
    note                :   { type: String, default : 'Descript' },
    status              :   { type: Number, default : 0 },
    like_max            :   { type: Number },
    time_create        	:   { type: Number },
    time_done           :   { type: Number, default : 0 },
    time_update         :   { type: Number, default : 0 },

});

BuffLikeSchema.plugin(AutoIncrement, {inc_field: 'idLike'});

module.exports = mongoose.model('buff-like', BuffLikeSchema);
