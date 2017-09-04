import { NotFoundError, BadRequestError, InternalError, Request, Response, Next } from 'restify';

import { ContentType } from '../contenttype';
import { Category, CategoryFactory } from '../shared/models/category';
import { CategoryService } from '../services/category-service';


export class CategoryController {

    // GET: Return all Categories
    getAll(req: Request, res: Response, next: Next) {
        CategoryService.getAll((err, rows) => {
            if (err) return next(new InternalError());
            if (!rows.length) res.send([], ContentType.ApplicationJSON);
            let categories: Category[] = rows.map(row => CategoryFactory.fromObj(row));
            res.send(categories, ContentType.ApplicationJSON);
        });
    };

    // GET: Return single Category
    getById(req: Request, res: Response, next: Next) {
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

    // POST: Add new Category
    addCategory(req: Request, res: Response, next: Next) {
        CategoryService.addCategory(CategoryFactory.toDbObject(req.body), (err, result) => {
            if (err) return next(new BadRequestError());
            if (result) {
                CategoryService.getById(result.insertId, (err, row) => {
                    if (err) return next(new InternalError());
                    res.send(201, CategoryFactory.fromObj(row), ContentType.ApplicationJSON);
                });
            } else next(new InternalError());
        });
    };
}
