import { createServer, bodyParser, CORS, queryParser, serveStatic } from 'restify';
import { ProductController } from './src/controller/product-controller';
import { ProductService } from './src/services/product-service';
import { ServerController } from './src/controller/server-controller';

var config = require('./config');
let productController = new ProductController(new ProductService());
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

// serve public folder
server.get(/^(?!\/(product|info)).*/, serveStatic({
  directory: __dirname + '/public/',
  default: 'index.html'
}));

// other routes
server.get('/info', serverController.info.bind(serverController));
server.get('/swagger.json', serverController.getFixedSwaggerJson.bind(serverController));

// API routes
server.get('/products', productController.getAll.bind(productController));
server.del('/products', productController.reset.bind(productController));
server.post('/product', productController.create.bind(productController));
server.get('/product/:productId', productController.getById.bind(productController));
server.put('/product/:productId', productController.update.bind(productController));
server.del('/product/:productId', productController.delete.bind(productController));

// start server
server.listen(config.port, () => {
  console.log('ILTIS API server on %s', server.url);
});
