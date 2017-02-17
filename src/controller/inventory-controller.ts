import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Validator } from '../modules/validator';
import { Inventory } from '../models/inventory/inventory';
import { InventoryFactory } from '../models/inventory/inventory-factory';
import { InventoryService } from '../services/inventory-service';
import { Product } from '../models/product/product';
import { ProductFactory } from '../models/product/product-factory';
import { ProductService } from '../services/product-service';
import { SizeType } from '../models/sizetype/sizetype';
import { SizeTypeFactory } from '../models/sizetype/sizetype-factory';
import { SizeTypeService } from '../services/sizetype-service';
import { Category } from '../models/category/category';
import { CategoryFactory } from '../models/category/category-factory';
import { CategoryService } from '../services/category-service';
import { Unit } from '../models/unit/unit';
import { UnitFactory } from '../models/unit/unit-factory';
import { UnitService } from '../services/unit-service';


export class InventoryController {
    private productService : ProductService;
    private sizeTypeService : ProductService;
    private categoryService : CategoryService;
    private unitService : UnitService;

    constructor(private inventoryService : InventoryService) {
        this.productService = new ProductService();
        this.sizeTypeService = new ProductService();
        this.categoryService = new CategoryService();
        this.unitService = new UnitService();
    }

    getCurrent(req, res, next) {
        let inventory : Inventory[] = [];
        this.inventoryService.getCurrent((err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            inventory = rows1.map(row => InventoryFactory.fromObj(row));
            this.sizeTypeService.getAll((err, rows2) => {
                if (err) return next(err);
                var sizeTypes : SizeType[] = rows2.map(row => SizeTypeFactory.fromObj(row));
                this.productService.getAll((err, rows3)=>{
                    if (err) return next(err);
                    var products = rows3.map(row => ProductFactory.fromObj(row));
                    this.categoryService.joinProducts((err, rows4) => {
                        if (err) return next(err);
                        var categories : Category[] = rows4.map(row => CategoryFactory.fromObj(row));
                        this.unitService.joinProducts((err, rows5) => {
                            if (err) return next(err);
                            var units : Unit[] = rows5.map(row => UnitFactory.fromObj(row));

                            products = products.map(p => {
                                p.category = categories.find(f => f.id === p.category.id);
                                return p;
                            }).map(p => {
                                p.unit = units.find(f => f.id === p.unit.id);
                                return p;
                            });

                            inventory = inventory.map(i => {
                                i.sizeType = sizeTypes.find(f => f.id === i.sizeType.id);
                                return i;
                            }).map(i => {
                                i.product = products.find(f => f.id === i.product.id);
                                return i;
                            });

                            res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
                        });
                    });
                });
            });
        });
    };

    getByEventId(req, res, next) {
        let id = parseInt(req.params.eventId);
        let inventory : Inventory[] = [];
        this.inventoryService.getByEventId(id, (err, rows1)=>{
            if (err) return next(err);
            if (!rows1.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            inventory = rows1.map(row => InventoryFactory.fromObj(row));
            this.sizeTypeService.getAll((err, rows2) => {
                if (err) return next(err);
                var sizeTypes : SizeType[] = rows2.map(row => SizeTypeFactory.fromObj(row));
                this.productService.getAll((err, rows3)=>{
                    if (err) return next(err);
                    var products = rows3.map(row => ProductFactory.fromObj(row));
                    this.categoryService.joinProducts((err, rows4) => {
                        if (err) return next(err);
                        var categories : Category[] = rows4.map(row => CategoryFactory.fromObj(row));
                        this.unitService.joinProducts((err, rows5) => {
                            if (err) return next(err);
                            var units : Unit[] = rows5.map(row => UnitFactory.fromObj(row));

                            products = products.map(p => {
                                p.category = categories.find(f => f.id === p.category.id);
                                return p;
                            }).map(p => {
                                p.unit = units.find(f => f.id === p.unit.id);
                                return p;
                            });

                            inventory = inventory.map(i => {
                                i.sizeType = sizeTypes.find(f => f.id === i.sizeType.id);
                                return i;
                            }).map(i => {
                                i.product = products.find(f => f.id === i.product.id);
                                return i;
                            });

                            res.send(inventory, { 'Content-Type': 'application/json; charset=utf-8' });
                        });
                    });
                });
            });
        });
    };
}