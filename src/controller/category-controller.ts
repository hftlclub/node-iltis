import { NotFoundError, BadRequestError, ConflictError } from 'restify';
import { Category, CategoryFactory } from '../shared/models/category';
import { CategoryService } from '../services/category-service';


export class CategoryController {

    getAll(req, res, next) {
        let categories: Category[] = [];
        CategoryService.getAll((err, rows)=>{
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
        let category: Category = CategoryFactory.empty();
        CategoryService.getById(id, (err, row)=>{
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