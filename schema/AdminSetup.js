var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var AdminSchema =  mongoose.Schema({
    // Buff Eye
    price_one_eye            :   { type: Number , required: true },
    view_max                 : 	 { type: Number , required: true },
    // Buff COMMENT
    price_comment_randum     : 	 { type: Number , required: true },  
    price_comment_choose     : 	 { type: Number , required: true },  
    comment_max              : 	 { type: Number , required: true }, 
    // Buff Like
    price_like               :   { type: Number , required: true },  
    like_max                 :   { type: Number , required: true }, 
    // VIP EYE
    quantity_vip_eye         :   { type: Array , "default": [] },     
    price_vip_eye            :   { type: Number , required: true },
    // SCAN COMMENT
    // price_scan_cmt           :   { type: Number , required: true },
    // quantity_scan_cmt        :   { type: Array , "default": [] },
    list_combo_scan_cmt      :   { type: Array , "default": [] },
    // SEEDING COMMENT
    price_seeding_cmt        :   { type: Number , required: true },
    time_option              :   { type: Array , "default": [] },     
    time_create              :   { type: Number },   
    time_update              :   { type: Number, default : 0 },

});

AdminSchema.plugin(AutoIncrement, {inc_field: 'id_AdSetup'});

module.exports = mongoose.model('admin', AdminSchema);
