var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var EndUserSchema =  mongoose.Schema({
    user_name                :  { type: String , required: true   }, 
    phone                    :  { type: String , required: true   },
    email                    :  { type: String , required: true  , unique: true},
    fullName                 :  { type: String , required: true   },
    birthday                 :  { type: String , required: true   },
    sex                      :  { type: String , required: true   },
    address                  :  { type: String , required: true   },
    balance                  :  { type: String },
    role                     :  { type: String },
    time_create              :  { type: String }
});

EndUserSchema.plugin(AutoIncrement, {inc_field: 'idScanCmt'});

module.exports = mongoose.model('scan_comment', EndUserSchema);
