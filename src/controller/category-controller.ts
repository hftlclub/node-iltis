import { NotFoundError, BadRequestError, ConflictError } from 'restify';

import { ContentType } from '../contenttype';
import { Category, CategoryFactory } from '../shared/models/category';
import { CategoryService } from '../services/category-service';


export class CategoryController {

    getAll(req, res, next) {
        let categories: Category[] = [];
        CategoryService.getAll((err, rows) => {
            if (err) return next(err);
            if (!rows.length) {
                // Todo: Implementet correct feedback (error 204)
                res.send(categories, ContentType.ApplicationJSON);
            }
            categories = rows.map(row => CategoryFactory.fromObj(row));
            res.send(categories, ContentType.ApplicationJSON);
        });
    };

    getById(req, res, next) {
        let categoryId = parseInt(req.params.categoryId, 0);
        let category: Category = CategoryFactory.empty();
        CategoryService.getById(categoryId, (err, row) => {
            if (err) return next(err);
            if (!row) {
                // Todo: Implementet correct feedback (error 204)
                next(new NotFoundError('Category does not exist'));
            }
            category = CategoryFactory.fromObj(row);
            res.send(category, ContentType.ApplicationJSON);
        });
    };
}
