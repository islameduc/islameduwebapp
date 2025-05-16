import { NextFunction, Request, Response, Router } from 'express'

import { authJwt } from '@/middleware/index'
import { CategoryService } from '@/resources/category'
import HttpException from '@/utils/exceptions/http.exception'
import { STATUS_CODES } from '@/utils/helper/constants'
import { Controller } from '@/utils/interfaces'

class CategoryController implements Controller {
    public path = '/categories'
    public router = Router()
    private categoryService = new CategoryService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes = (): void => {
        this.router.post(
            `${this.path}/add-category`,
            [authJwt.isSuperAdmin],
            this.addCategory
        )

        this.router.get(
            this.path,
            this.getCategories
        )

        this.router.get(`${this.path}/:categoryId`, this.getCategoryPosts)

        this.router.patch(`${this.path}/:categoryId`, [authJwt.isSuperAdmin], this.updateCategory)

        this.router.delete(
            `${this.path}/:categoryId`,
            [authJwt.isSuperAdmin],
            this.deleteCategoryById
        )
    }

    private addCategory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const newCategory = await this.categoryService.addCategory(req)

            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Category added successfully',
                newPost: newCategory
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getCategories = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.categoryService.getCategories(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getCategoryPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const posts = await this.categoryService.getCategoryPosts(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(posts)
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private updateCategory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.categoryService.updateCategory(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                .json({ "message": "Category updated successfully" })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteCategoryById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.categoryService.deleteCategoryById(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                .json({ "message": "Category deleted successfully" })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
}

export default CategoryController
