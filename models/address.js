const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AddressSchema = new Schema(
    {
        city: {type: String, required: true},
        street: {type: String, required: true},
        building_number: {type: Number, required: true}
    }
);

AddressSchema
    .virtual('url')
    .get(function () {
        return '/catalog/address/' + this._id;
    });

//Export model
module.exports = mongoose.model('Address', AddressSchema);