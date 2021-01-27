const Table = require('../models/table');
const Restaurant = require('../models/restaurant');
var async = require('async');
const { body,validationResult } = require("express-validator");

exports.table_list = function(req, res, next) {

    Table.find({}, 'restaurant status table_number')
        .populate('restaurant')
        .exec(function (err, table_list) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('table_list', { title: 'Список столиков', table_list: table_list });
        });

};

exports.table_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Table detail: ' + req.params.id);
};

exports.table_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Table create GET');
};

exports.table_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Table create POST');
};

exports.table_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Table delete GET');
};

exports.table_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Table delete POST');
};

exports.table_update_get = function(req, res, next) {

    async.parallel({
        table: function(callback) {
            Table.findById(req.params.id).populate('restaurant').exec(callback);
        },
        restaurants: function(callback) {
            Restaurant.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.table==null) { // No results.
            var err = new Error('Столик не найден');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('table_form', { title: 'Забронировать столик', restaurants: results.restaurants, table: results.table });
    });

};

exports.table_update_post = [

    // Validate and sanitise fields.
    body('reserved_for', 'Впишите верное имя!').trim().matches(/^((?!<script[^>]*?>.*?(<\/script>|)?.*).)*$/si).isLength({ min: 1 }).escape(),
    body('available_after', 'Укажите время, до которого оформить бронь').trim().isLength({ min: 1 }).escape(),
    body('reserved_from', 'Укажите время, c которого оформить бронь').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var table = new Table(
            {
                restaurant: req.params.restaurant,
                capacity: req.params.capacity,
                table_number: req.params.table_number,
                near_window: req.params.near_window,
                status: 'Reserved',
                reserved_for: req.body.reserved_for,
                reserved_from: req.body.reserved_from,
                available_after: req.body.available_after,
                _id:req.params.id //This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                restaurants: function(callback) {
                    Restaurant.find(callback);
                },
                table: function(callback) {
                    Table.findById(req.params.id).populate('restaurant').exec(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('table_form', { title: 'Забронировать столик',restaurants: results.restaurants, table: results.table, errors: errors.array() });
            });
        }
        else {
            // Data from form is valid. Update the record.
            Table.findByIdAndUpdate(req.params.id, table, {}, function (err,the_table) {
                if (err) { return next(err); }
                // Successful - redirect to book detail page.
                res.redirect(the_table.url + '/update');
            });
        }
    }
];