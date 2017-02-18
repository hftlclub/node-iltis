import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Product } from '../shared/models/product/product';
import { Category } from '../shared/models/category/category';
import { Unit } from '../shared/models/unit/unit';
import { CrateType } from '../shared/models/cratetype/cratetype';
import { SizeType } from '../shared/models/sizeType/sizetype';
import { ProductFactory } from '../shared/models/product/product-factory';
import { ProductService } from '../services/product-service';
import { CategoryFactory } from '../shared/models/category/category-factory';
import { CategoryService } from '../services/category-service';
import { UnitFactory } from '../shared/models/unit/unit-factory';
import { UnitService } from '../services/unit-service';
import { CrateTypeFactory } from '../shared/models/cratetype/cratetype-factory';
import { CrateTypeService } from '../services/cratetype-service';
import { SizeTypeFactory } from '../shared/models/sizetype/sizetype-factory';
import { SizeTypeService } from '../services/sizetype-service';

interface CrateTypeProduct {
    refProduct: number;
    crateType: CrateType;
}

interface SizeTypeProduct {
    refProduct: number;
    sizeType: SizeType;
}

export class ProductController {
    private categoryService: CategoryService;
    private unitService: UnitService;
    private crateTypeService: CrateTypeService;
    private sizeTypeService: SizeTypeService;

    constructor(private productService: ProductService) {
        this.categoryService = new CategoryService();
        this.unitService = new UnitService();
        this.crateTypeService = new CrateTypeService();
        this.sizeTypeService = new SizeTypeService();
    }

    getAll(req, res, next) {
        let products: Product[] = [];
        this.productService.getAll((err, rows)=>{
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(products, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            products = rows.map(row => ProductFactory.fromObj(row));
            this.categoryService.joinProducts((err, rows2) => {
                if (err) return next(err);
                var categories: Category[] = rows2.map(row => CategoryFactory.fromObj(row));
                this.unitService.joinProducts((err, rows3) => {
                    if (err) return next(err);
                    var units: Unit[] = rows3.map(row => UnitFactory.fromObj(row));
                    this.crateTypeService.joinProductCrates((err, rows5) => {
                        if (err) return next(err);
                        var crateTypesProducts: CrateTypeProduct[] = rows5.map(row => {
                            return {refProduct: row.refProduct, crateType: CrateTypeFactory.fromObj(row)};
                        });
                        this.sizeTypeService.joinProductSizes((err, rows5) => {
                            if (err) return next(err);
                            var sizeTypesProducts: SizeTypeProduct[] = rows5.map(row => {
                                return {refProduct: row.refProduct, sizeType: SizeTypeFactory.fromObj(row)};
                            });
                            this.sizeTypeService.getAll((err, rows5) => {
                                if (err) return next(err);
                                var sizeTypes: SizeType[] = rows5.map(row => SizeTypeFactory.fromObj(row));

                                products = products.map(p => {
                                    p.category = categories.find(f => f.id === p.category.id);
                                    return p;
                                }).map(p => {
                                    p.unit = units.find(f => f.id === p.unit.id);
                                    return p;
                                });

                                crateTypesProducts = crateTypesProducts.map(c => {
                                    c.crateType.sizeType = sizeTypes.find(f => f.id === c.crateType.sizeType.id);
                                    return c;
                                });
                                
                                crateTypesProducts.forEach(crateTypeProduct => {
                                    products.find(f => f.id === crateTypeProduct.refProduct).crateTypes.push(crateTypeProduct.crateType);
                                });
                                
                                sizeTypesProducts.forEach(sizeTypeProduct => {
                                    products.find(f => f.id === sizeTypeProduct.refProduct).sizeTypes.push(sizeTypeProduct.sizeType);
                                });

                                res.send(products, { 'Content-Type': 'application/json; charset=utf-8' });
                            });
                        });
                    });
                });
            });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.productId);
        let product: Product = ProductFactory.empty();
        this.productService.getById(id, (err, row1)=>{
            if (err) return next(err);
            if (!row1) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('Product does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            product = ProductFactory.fromObj(row1);
            this.categoryService.getById(row1.refCategory, (err, row2) => {
                if (err) return next(err);
                product.category = CategoryFactory.fromObj(row2);
                this.unitService.getById(row1.refUnit, (err, row3) => {
                    if (err) return next(err);
                    product.unit = UnitFactory.fromObj(row3);
                    this.sizeTypeService.joinProductByProductId(product.id, (err, rows5) => {
                        if (err) return next(err);
                        product.sizeTypes = rows5.map(row => SizeTypeFactory.fromObj(row));
                        this.crateTypeService.joinProductCratesByProductId(product.id, (err, rows4) => {
                            if (err) return next(err);
                            if (!rows4.length) {
                                res.send(product, { 'Content-Type': 'application/json; charset=utf-8' });
                            }
                            var crateTypes: CrateType[] = rows4.map(row => CrateTypeFactory.fromObj(row));
                            this.sizeTypeService.joinCrateTypes((err, rows6) => {
                            if (err) return next(err);
                                var sizeTypes: SizeType[] = rows6.map(row => SizeTypeFactory.fromObj(row));
                                crateTypes = crateTypes.map(c => {
                                    c.sizeType = sizeTypes.find(f => f.id === c.sizeType.id);
                                    return c;
                                });
                                product.crateTypes = crateTypes;
                                res.send(product, { 'Content-Type': 'application/json; charset=utf-8' });
                            });
                        });
                        
                    });
                });
            });
        });
    };
}
