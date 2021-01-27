const Restaurant = require('../models/restaurant');

var Table = require('../models/table');
var Address = require('../models/address');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        table_count: function(callback) {
            Table.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        restaurant_count: function(callback) {
            Restaurant.countDocuments({}, callback);
        },
        address_count: function(callback) {
            Address.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Рестораны компании "Поедовъ"', error: err, data: results });
    });
};

exports.restaurant_list = function(req, res, next) {

    Restaurant.find({}, 'restaurant_name address img_link open_time close_time capacity current_amount')
        .populate('address')
        .exec(function (err, restaurant_list) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('restaurant_list', { title: 'Список ресторанов', restaurant_list: restaurant_list });
        });

};

exports.restaurant_detail = function(req, res, next) {

    async.parallel({
        restaurant: function(callback) {
            Restaurant.findById(req.params.id)
                .populate('address')
                .exec(callback);
        },

        restaurant_tables: function(callback) {
            Table.find({ 'restaurant': req.params.id })
                .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.restaurant==null) { // No results.
            var err = new Error('Restaurant not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('restaurant_detail', { title: 'Подробнее о ресторане', restaurant: results.restaurant, restaurant_tables: results.restaurant_tables } );
    });

};

exports.restaurant_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Restaurant create GET');
};

exports.restaurant_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Restaurant create POST');
};

exports.restaurant_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Restaurant delete GET');
};

exports.restaurant_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Restaurant delete POST');
};

exports.restaurant_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Restaurant update GET');
};

exports.restaurant_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Restaurant update POST');
};