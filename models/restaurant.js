const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
    {
        restaurant_name: {type: String, required: true, maxlength: 100},
        address: {type: Schema.Types.ObjectId, ref: 'Address', required: true},
        capacity: {type: Number, required: true},
        current_amount: {type: Number, required: true},
        open_time: {type: String, required: true},
        close_time: {type: String, required: true},
        img_link: {type: String, required: true}
    }
);

RestaurantSchema
    .virtual('free_tables_amount')
    .get(function () {
        return this.capacity - this.current_amount;
    });

RestaurantSchema
    .virtual('url')
    .get(function () {
        return '/catalog/restaurant/' + this._id;
    });

//Export model
module.exports = mongoose.model('Restaurant', RestaurantSchema);
