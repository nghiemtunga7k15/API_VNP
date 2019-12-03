var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var ScanCommentSchema =  mongoose.Schema({
    fb_id         	         :   { type: String, required: true },
    total_comment            :   { type: Number, default : 0 },
    content                  :   {
        user_id    :  { type: String },
        face_name   : { type: String },
        content_cmt : { type: String },
        time_cmt    : { type: String },
        phone       : { type: String },
        email       : { type: String },
    },   
    type_order               :   { type: String , default : 0 },   // 0 GÓI THƯỜNG 1 GÓI VIP
    total_price_pay          :   { type: Number , default : 0 }, 
    status                   :   { type: Number , default : 0 },
    time_done                :   { type: Number , default : 0 },
    time_create              :   { type: String },
    time_update              :   { type: Number, default : 0 },
});

ScanCommentSchema.plugin(AutoIncrement, {inc_field: 'idScanCmt'});

module.exports = mongoose.model('scan-comment', ScanCommentSchema);
