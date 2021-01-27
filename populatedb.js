#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const async = require('async');
const Table = require('./models/table');
const Restaurant = require('./models/restaurant');
const Address = require('./models/address');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const restaurants = [];
const addresses = [];
const tables = [];

function restaurantCreate(restaurant_name, address, capacity, current_amount, open_time, close_time, img_link, cb) {
    const restaurant_detail = {
        restaurant_name:restaurant_name,
        address:address,
        capacity:capacity,
        current_amount:current_amount,
        open_time:open_time,
        close_time:close_time,
        img_link:img_link
    };

    const restaurant = new Restaurant(restaurant_detail);

    restaurant.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New Restaurant: ' + restaurant);
        restaurants.push(restaurant);
        cb(null, restaurant)
    }  );
}

function addressCreate(city, street, building_number, cb) {
    const address = new Address({city:city, street:street, building_number:building_number});

    address.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Address: ' + address);
        addresses.push(address);
        cb(null, address);
    }   );
}

function tableCreate(restaurant, capacity, table_number, near_window, status, reserved_for, reserved_from, available_after, cb) {
    const table_detail = {
        restaurant: restaurant,
        capacity: capacity,
        table_number: table_number,
        near_window: near_window,
        status: status
    };

    if(reserved_for) table_detail.reserved_for = reserved_for;
    if(reserved_from) table_detail.reserved_from = reserved_from;
    if(available_after) table_detail.available_after = available_after;

    const table = new Table(table_detail);
    table.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New Table: ' + table);
        tables.push(table);
        cb(null, table)
    }  );
}

function createAddresses(cb) {
    async.series([
            function(callback) {
                addressCreate("Санкт-Петербург", "Пушкина", 12, callback);
            },
            function(callback) {
                addressCreate("Санкт-Петербург", "Колотушкина", 43, callback);
            },
            function(callback) {
                addressCreate("Екатеринбург", "Ленина", 666, callback);
            },
        ],
        cb);
}

function createRestaurants(cb) {
    async.series([
            function(callback) {
                restaurantCreate('Рыбное место', addresses[0], 50, 25, '10:00', '23:00', '/images/ryba.jpg', callback);
            },
            function(callback) {
                restaurantCreate('Скотный двор', addresses[1], 70, 55, '12:00', '02:00', '/images/myaso.jpg', callback);
            },
            function(callback) {
                restaurantCreate('Беллетрист', addresses[2], 30, 25, '10:00', '20:00', '/images/hipster.jpeg', callback);
            },
        ],
        cb);
}


function createTables(cb) {
    async.parallel([
            function(callback) {
                tableCreate(restaurants[0], 2, 1, true, 'Reserved', 'Александр', '15:00','18:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[0], 3, 2, true, 'Reserved', 'Мария', '15:00','16:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[0], 2, 3, false, 'Reserved', 'Иван', '12:00', '17:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[0], 4, 4, false, 'Reserved', 'Николай', '11:00', '12:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[0], 2, 5, true, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[0], 4, 6, false, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[0], 1, 7, true, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[1], 1, 1, true, 'Reserved', 'Дмитрий', '15:00', '20:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[1], 2, 2, true, 'Reserved', 'Анстасия', '17:00', '18:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[1], 3, 3, false, 'Reserved', 'Киборг', '12:00', '16:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[1], 4, 4, false, 'Reserved', 'София', '13:00', '16:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[1], 2, 5, true, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[1], 4, 6, false, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[1], 1, 7, true, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[2], 2, 1, true, 'Reserved', 'Павел', '16:00',  '18:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[2], 2,2, true, 'Reserved', 'Паша', '12:00', '15:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[2], 1,3, false, 'Reserved', 'Павлик', '15:00', '18:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[2], 2,4, false, 'Reserved', 'Георгий', '17:00', '18:00', callback);
            },
            function(callback) {
                tableCreate(restaurants[2], 2, 5, true, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[2], 4, 6, false, 'Available', false, false, false, callback);
            },
            function(callback) {
                tableCreate(restaurants[2], 1, 7, true, 'Available', false, false, false, callback);
            },
        ],
        cb);
}

async.series([
        createAddresses,
        createRestaurants,
        createTables,
    ],
// Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        else {
            console.log('tables: '+tables);

        }
        // All done, disconnect from database
        mongoose.connection.close();
    });



