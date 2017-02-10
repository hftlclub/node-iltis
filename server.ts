import { createServer, bodyParser, CORS, queryParser, serveStatic } from 'restify';
import { ProductStoreController } from './src/controller/product-controller';
import { ProductStore } from './src/services/product-service';
import { ServerController } from './src/controller/server-controller';

var config = require('./config');
let productStoreController = new ProductStoreController(new ProductStore());
let serverController = new ServerController();

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

server.get('/swagger.json', serverController.getFixedSwaggerJson.bind(serverController));

// serve public folder
server.get(/^(?!\/(product|info)).*/, serveStatic({
  directory: __dirname + '/public/',
  default: 'index.html'
}));

// API routes
server.get('/products', productStoreController.getAll.bind(productStoreController));
server.del('/products', productStoreController.reset.bind(productStoreController));
server.post('/product', productStoreController.create.bind(productStoreController));
server.get('/product/:productId', productStoreController.getById.bind(productStoreController));
//server.get('/product/:productId/check', productStoreController.checkId.bind(productStoreController));
server.put('/product/:productId', productStoreController.update.bind(productStoreController));
server.del('/product/:productId', productStoreController.delete.bind(productStoreController));
server.get('/info', serverController.info.bind(serverController));

// start server
server.listen(config.port, function () {
  console.log('ILTIS API server on %s', server.url);
});
