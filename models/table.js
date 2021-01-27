const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TableSchema = new Schema(
    {
        restaurant: {type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},
        capacity: {type: String, required: true},
        table_number: {type: Number, required: true},
        near_window: {type: Boolean, required: true},
        status: {
            type: String,
            required: true,
            enum: ['Available', 'Reserved'],
            default: 'Available'
        },
        reserved_for: {type: String},
        reserved_from: {type: String},
        available_after: {type: String}
    }
);

TableSchema
    .virtual('url')
    .get(function () {
        return '/catalog/table/' + this._id;
    });

//Export model
module.exports = mongoose.model('Table', TableSchema);