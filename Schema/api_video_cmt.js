var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var apiVideoCmts =  mongoose.Schema({
    video_id            :   { type: String },
    comments            :   { type: String },     
    comments_count      :   { type: Number },     
    delays         		:   { type: Number },
    time_create        	:   { type: Number },
    status              :   { type: Number, default : 0 },

});

apiVideoCmts.plugin(AutoIncrement, {inc_field: 'idVideo'});

module.exports = mongoose.model('video-comment', apiVideoCmts);
