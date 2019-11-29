var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var BuffCommentSchema =  mongoose.Schema({
    video_id            :   { type: String , required: true },
    type_buff           : 	{ type: String , required: true },
    price               : 	{ type: Number , required: true },
    comments            :   { type: String , required: true },     
    comments_count      :   { type: Number , required: true },     
    total_price_pay     :   { type: Number , required: true },     
    time_type           :   { type: Number },
    time_value          :   { type: Number },
    note                :   { type: String, default : 'Descript' },
    status              :   { type: Number, default : 0 },
    comment_max         :   { type: Number },
    time_create        	:   { type: Number },
    time_done           :   { type: Number, default : 0 },
    time_update         :   { type: Number, default : 0 },

});

BuffCommentSchema.plugin(AutoIncrement, {inc_field: 'idVideo'});

module.exports = mongoose.model('buff-comment', BuffCommentSchema);
