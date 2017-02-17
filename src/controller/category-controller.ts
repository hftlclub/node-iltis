import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Validator } from '../modules/validator';
import { Category } from '../models/category/category';
import { CategoryFactory } from '../models/category/category-factory';
import { CategoryService } from '../services/category-service';


export class CategoryController {

    constructor(private categoryService : CategoryService) { }

    getAll(req, res, next) {
        let categories : Category[] = [];
        this.categoryService.getAll((err, rows)=>{
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(categories, { 'Content-Type': 'application/json; charset=utf-8' });
            }
            categories = rows.map(row => CategoryFactory.fromObj(row));
            res.send(categories, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };

    getById(req, res, next) {
        let id = parseInt(req.params.categoryId);
        let category : Category = CategoryFactory.empty();
        this.categoryService.getById(id, (err, row)=>{
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                res.send(new NotFoundError('Category does not exist'), { 'Content-Type': 'application/json; charset=utf-8' });
            }
            category = CategoryFactory.fromObj(row);
            res.send(category, { 'Content-Type': 'application/json; charset=utf-8' });
        });
    };
}