import { NotFoundError, BadRequestError, InternalError } from 'restify';

import { ContentType } from '../contenttype';
import { Category, CategoryFactory } from '../shared/models/category';
import { CategoryService } from '../services/category-service';


export class CategoryController {

    // GET: Return all categories
    getAll(req, res, next) {
        CategoryService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let categories: Category[] = rows.map(row => CategoryFactory.fromObj(row));
            res.send(categories, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single category
    getById(req, res, next) {
        let categoryId = parseInt(req.params.categoryId, 0);
        let category: Category = CategoryFactory.empty();
        CategoryService.getById(categoryId, (err, row) => {
            if (err) return next(new BadRequestError('Invalid categoryId'));
            if (!row) {
                next(new NotFoundError('Category does not exist'));
            }
            category = CategoryFactory.fromObj(row);
            res.send(category, ContentType.ApplicationJSON);
        });
    };
}
