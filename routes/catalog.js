const express = require('express');
const router = express.Router();

// Require controller modules.
const table_controller = require('../controllers/table_controller');
const restaurant_controller = require('../controllers/restaurant_controller');
const address_controller = require('../controllers/address_controller');

/// TABLE ROUTES ///

// GET catalog home page.
router.get('/', restaurant_controller.index);

// GET request for creating a Table. NOTE This must come before routes that display Table (uses id).
router.get('/table/create', table_controller.table_create_get);

// POST request for creating Table.
router.post('/table/create', table_controller.table_create_post);

// GET request to delete Table.
router.get('/table/:id/delete', table_controller.table_delete_get);

// POST request to delete Table.
router.post('/table/:id/delete', table_controller.table_delete_post);

// GET request to update Table.
router.get('/table/:id/update', table_controller.table_update_get);

// POST request to update Table.
router.post('/table/:id/update', table_controller.table_update_post);

// GET request for one Table.
router.get('/table/:id', table_controller.table_detail);

// GET request for list of all Table items.
router.get('/tables', table_controller.table_list);

/// RESTAURANT ROUTES ///

// GET request for creating Restaurant. NOTE This must come before route for id (i.e. display restaurant).
router.get('/restaurant/create', restaurant_controller.restaurant_create_get);

// POST request for creating Restaurant.
router.post('/restaurant/create', restaurant_controller.restaurant_create_post);

// GET request to delete Restaurant.
router.get('/restaurant/:id/delete', restaurant_controller.restaurant_delete_get);

// POST request to delete Restaurant.
router.post('/restaurant/:id/delete', restaurant_controller.restaurant_delete_post);

// GET request to update Restaurant.
router.get('/restaurant/:id/update', restaurant_controller.restaurant_update_get);

// POST request to update Restaurant.
router.post('/restaurant/:id/update', restaurant_controller.restaurant_update_post);

// GET request for one Restaurant.
router.get('/restaurant/:id', restaurant_controller.restaurant_detail);

// GET request for list of all Restaurants.
router.get('/restaurants', restaurant_controller.restaurant_list);

/// ADDRESS ROUTES ///

// GET request for creating a Address. NOTE This must come before route that displays Address (uses id).
router.get('/address/create', address_controller.address_create_get);

//POST request for creating Address.
router.post('/address/create', address_controller.address_create_post);

// GET request to delete Address.
router.get('/address/:id/delete', address_controller.address_delete_get);

// POST request to delete Address.
router.post('/address/:id/delete', address_controller.address_delete_post);

// GET request to update Address.
router.get('/address/:id/update', address_controller.address_update_get);

// POST request to update Address.
router.post('/address/:id/update', address_controller.address_update_post);

// GET request for one Address.
router.get('/address/:id', address_controller.address_detail);

// GET request for list of all Address.
router.get('/addresses', address_controller.address_list);

module.exports = router;