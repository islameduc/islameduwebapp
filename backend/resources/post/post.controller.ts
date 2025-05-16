import { NextFunction, Request, Response, Router } from 'express'

import { authJwt } from '@/middleware/index'
import { PostService } from '@/resources/post'
import HttpException from '@/utils/exceptions/http.exception'
import { STATUS_CODES } from '@/utils/helper/constants'
import { Controller } from '@/utils/interfaces'

class PostController implements Controller {
    public path = '/posts'
    public router = Router()
    private postService = new PostService()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes = (): void => {
        this.router.post(
            `${this.path}/add-post`,
            [authJwt.isSuperAdmin],
            this.addPost
        )

        this.router.get(
            `${this.path}/all`,
            this.getAllPosts
        )

        this.router.get(`${this.path}/:postId`, this.getPostDetails)

        this.router.patch(
            `${this.path}/:postId`,
            [authJwt.isSuperAdmin],
            this.updatePost
        )

        this.router.delete(
            `${this.path}/:postId`,
            [authJwt.isSuperAdmin],
            this.deletePost
        )
    }

    private addPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const newPost = await this.postService.addPost(req)

            res.status(STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                message: 'Post added successfully',
                newPost
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getAllPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.postService.getAllPosts(req)

            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getPostDetails = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const project = await this.postService.getPostDetails(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(project)
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private updatePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.postService.updatePost(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                .json({ "message": "Post updated successfully" })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deletePost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.postService.deletePost(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                .json({ "message": "Post deleted successfully" })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
}

export default PostController
