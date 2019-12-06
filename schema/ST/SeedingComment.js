var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var SeedingCommentSchema =  mongoose.Schema({
    key_word         	                  :   { type: String , required: true },
    content_seeding_post                  :   { type: String , required: true },
    content_seeding_reply_post            :   { type: String , required: true },
    content_send_comment                  :   { type: Array  , "default": [] },
    quantity_seeding                      :   { type: Number , required: true }, 
    total_price_pay                       :   { type: Number , default : 0 }, 
    status                                :   { type: Number , default : 0 },
    time_create                           :   { type: String },
    time_done                             :   { type: String },
    time_update                           :   { type: Number , default : 0 },
});

SeedingCommentSchema.plugin(AutoIncrement, {inc_field: 'idSeedingCmt'});

module.exports = mongoose.model('seeding_comment', SeedingCommentSchema);
