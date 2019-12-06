var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var ScanCommentSchema =  mongoose.Schema({
    fb_id         	         :   { type: String, required: true },
    total_comment            :   { type: Number, default : 0 },
    content                  :    { type: Array , "default": [] },
    type_order :   {
        name              :     { type: String },
        limit_post        :     { type: String },
        price_pay_buy     :     { type: String },
        price_pay_cmt     :     { type: String },
    },
    total_price_pay          :   { type: Number , default : 0 }, 
    status                   :   { type: Number , default : 0 },
    time_create              :   { type: String },
    minutes                  :   { type: String },
    time_expired             :   { type: String },
    time_update              :   { type: Number, default : 0 },
});

ScanCommentSchema.plugin(AutoIncrement, {inc_field: 'idScanCmt'});

module.exports = mongoose.model('scan_comment', ScanCommentSchema);
