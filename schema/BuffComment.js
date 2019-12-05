var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var BuffCommentSchema =  mongoose.Schema({
    video_id            :   { type: String , required: true },
    type_buff           : 	{ type: String , required: true },
    comments            :   { type: Array , "default": [] },     
    comments_count      :   { type: Number , required: true },     
    total_price_pay     :   { type: Number , required: true },   
    time_type           :   { type: Number  , default : 0},  // 0 là delay 1 là time buff done
    time_value          :   { type: Number  , default : 0  },
    note                :   { type: String, default : 'Descript' },
    status              :   { type: Number, default : 0 },
    comment_max         :   { type: Number },
    time_create        	:   { type: Number },
    time_done           :   { type: Number, default : 0 },
    time_update         :   { type: Number, default : 0 },

});

BuffCommentSchema.plugin(AutoIncrement, {inc_field: 'idVideo'});

module.exports = mongoose.model('buff_comment', BuffCommentSchema);
