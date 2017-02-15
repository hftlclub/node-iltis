import { createServer, bodyParser, CORS, queryParser, serveStatic } from 'restify';
import { ProductController } from './src/controller/product-controller';
import { ProductService } from './src/services/product-service';
import { ServerController } from './src/controller/server-controller';
import { CategoryService } from './src/services/category-service';
import { CategoryController } from './src/controller/category-controller';
import { UnitService } from './src/services/unit-service';
import { UnitController } from './src/controller/unit-controller';
import { SizeTypeService } from './src/services/sizetype-service';
import { SizeTypeController } from './src/controller/sizetype-controller';
import { CrateTypeService } from './src/services/cratetype-service';
import { CrateTypeController } from './src/controller/cratetype-controller';
import { EventService } from './src/services/event-service';
import { EventController } from './src/controller/event-controller';
import { EventTypeService } from './src/services/eventtype-service';
import { EventTypeController } from './src/controller/eventtype-controller';

var config = require('./config');
let serverController = new ServerController();
let productController = new ProductController(new ProductService());
let categoryController = new CategoryController(new CategoryService());
let unitController = new UnitController(new UnitService());
let sizeTypeController = new SizeTypeController(new SizeTypeService());
let crateTypeController = new CrateTypeController(new CrateTypeService());
let eventController = new EventController(new EventService());
let eventTypeController = new EventTypeController(new EventTypeService());

var server = createServer({
    formatters: {
        'application/json': function (req, res, body, cb) {
            return cb(null, JSON.stringify(body, null, '  '));
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

// start server
server.listen(config.port, () => {
    console.log('ILTIS API on %s', server.url);
});
