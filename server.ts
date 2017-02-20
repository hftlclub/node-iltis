import { createServer, bodyParser, CORS, queryParser, serveStatic } from 'restify';
import { ProductController } from './src/controller/product-controller';
import { ServerController } from './src/controller/server-controller';
import { CategoryController } from './src/controller/category-controller';
import { UnitController } from './src/controller/unit-controller';
import { SizeTypeController } from './src/controller/sizetype-controller';
import { CrateTypeController } from './src/controller/cratetype-controller';
import { EventController } from './src/controller/event-controller';
import { EventTypeController } from './src/controller/eventtype-controller';
import { InventoryController } from './src/controller/inventory-controller';
import { TinyJson } from './src/shared/tinyjson';

var config = require('./config');

let serverController = new ServerController();
let productController = new ProductController();
let categoryController = new CategoryController();
let unitController = new UnitController();
let sizeTypeController = new SizeTypeController();
let crateTypeController = new CrateTypeController();
let eventController = new EventController();
let eventTypeController = new EventTypeController();
let inventoryController = new InventoryController();
let inventoryTypeController = new InventoryController();

var server = createServer({
    formatters: {
        'application/json': function (req, res, body, cb) {
            return cb(null, TinyJson.getJSON(body));
        }
    }
});

server.use(bodyParser());
server.use(CORS({}));
server.use(queryParser());

// serve public folder
server.get(/^(?!\/(product|category|categories|event|transfer|inventory|category|categories|unit|cratetype|sizetype|info|img)).*/, serveStatic({
    directory: __dirname + '/public/',
    default: 'index.html'
}));

// other routes
server.get('/info', serverController.info.bind(serverController));
server.get('/swagger.json', serverController.getFixedSwaggerJson.bind(serverController));

// API routes
server.get('/products', productController.getAll.bind(productController));
server.get('/product/:productId', productController.getById.bind(productController));
server.get('/events', eventController.getAll.bind(eventController));
server.get('/event/:eventId', eventController.getById.bind(eventController));
server.get('/event/:eventId/transfers', eventController.getEventTransfers.bind(eventController));
server.get('/event/:eventId/transactions', eventController.getEventTransactions.bind(eventController));
server.get('/event/:eventId/calculation', eventController.getCalculation.bind(eventController));
server.get('/eventtypes', eventTypeController.getAll.bind(eventTypeController));
server.get('/eventtype/:eventTypeId', eventTypeController.getById.bind(eventTypeController));
server.get('/categories', categoryController.getAll.bind(categoryController));
server.get('/category/:categoryId', categoryController.getById.bind(categoryController));
server.get('/units', unitController.getAll.bind(unitController));
server.get('/unit/:unitId', unitController.getById.bind(unitController));
server.get('/sizetypes', sizeTypeController.getAll.bind(sizeTypeController));
server.get('/sizetype/:sizeTypeId', sizeTypeController.getById.bind(sizeTypeController));
server.get('/cratetypes', crateTypeController.getAll.bind(crateTypeController));
server.get('/cratetype/:crateTypeId', crateTypeController.getById.bind(crateTypeController));
server.get('/inventory', inventoryController.getCurrent.bind(inventoryController));
server.get('/inventory/:eventId', inventoryController.getByEventId.bind(inventoryController));

server.post('/event', eventController.addEvent.bind(eventController));

// start server
server.listen(config.port, () => {
    console.log('ILTIS API on %s', server.url);
});
