import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'

import { FileModel } from '@/resources/file'
import { Post, PostModel } from '@/resources/post'
import { CategoryModel } from '@/resources/category'
import { paginationResult } from '@/utils/definitions/custom'
import HttpException from '@/utils/exceptions/http.exception'
import {
    API_HOST,
    FILE_STRUCTURE,
    PAGINATION,
    ROLES,
    STATUS_CODES,
    UPLOADS_SHORT_URL
} from '@/utils/helper/constants'
import { saveFile } from '@/utils/helper/utils'

class PostService {
    /**
     * Add a new post
     */
    public async addPost(req: Request): Promise<Post | Error> {
        try {
            const userId = req.user._id
            const { body, files } = req
            const title = body.title
            const content = body.content
            const categoryId = body.categoryId
            let imageFile
            let videoFile

            const postImage = files?.postImage as UploadedFile

            if (postImage) {
                // Add post image
                const imageFilePath = saveFile(
                    FILE_STRUCTURE.POST_IMAGE_DIR,
                    postImage as UploadedFile
                )

                const imageArr = postImage.name.split('.')
                const imageExt = imageArr[imageArr.length - 1]
                imageFile = await new FileModel({
                    httpPath: imageExt,
                    dirPath: imageFilePath,
                    name: postImage.name,
                    size: postImage.size,
                    mimetype: postImage.mimetype,
                    uploadedBy: userId
                }).save()
            }

            const postVideo = files?.postVideo as UploadedFile
            if (postVideo) {


                // Add post video
                const videoFilePath = saveFile(
                    FILE_STRUCTURE.POST_VIDEO_DIR,
                    postVideo as UploadedFile
                )

                const videoArr = postVideo.name.split('.')
                const videoExt = videoArr[videoArr.length - 1]
                videoFile = await new FileModel({
                    httpPath: videoExt,
                    dirPath: videoFilePath,
                    name: postVideo.name,
                    size: postVideo.size,
                    mimetype: postVideo.mimetype,
                    uploadedBy: userId
                }).save()
            }

            let imageObject = imageFile ? { image: imageFile._id } : {}
            let videoObject = videoFile ? { video: videoFile._id } : {}

            const category = await CategoryModel.findOne({
                _id: categoryId,
                isDeleted: false
            }).exec()

            if (!category) {
                throw new HttpException(404, "Category not found")
            }

            const post = await new PostModel({
                title: toTitleCase(title),
                content,
                category: category.name,
                categoryId,
                author: userId,
                ...imageObject,
                ...videoObject,
            }).save()

            return post

        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get saved posts
     */
    public async getAllPosts(req: Request): Promise<paginationResult | Error> {
        const pageNumber =
            parseInt(req.query.pageNumber as string) ||
            PAGINATION.DEFAULT_PAGE_NUMBER
        const pageLimit =
            parseInt(req.query.limit as string) ||
            PAGINATION.DEFAULT_PAGE_LIMIT
        try {
            const startIndex = pageNumber * pageLimit
            const endIndex = (pageNumber + 1) * pageLimit

            const result: paginationResult = {
                total: 0,
                data: [],
                rowsPerPage: 0,
            }
            result.total = await PostModel.find({ isDeleted: false })
                .countDocuments()
                .exec()

            // Check if previous page exists and give page number
            if (startIndex > 0) {
                result.previous = {
                    pageNumber: pageNumber - 1,
                    pageLimit,
                }
            }

            // Check if next page exists and give page number
            if (endIndex < result.total) {
                result.next = {
                    pageNumber: pageNumber + 1,
                    pageLimit,
                }
            }

            result.data = await PostModel.find({ isDeleted: false })
                .populate({
                    path: 'author',
                    select: {
                        email: 1,
                        firstName: 1,
                        lastName: 1
                    }
                })
                .populate({
                    path: 'image',
                    select: {
                        httpPath: 1
                    }
                })
                .populate({
                    path: 'video',
                    select: {
                        httpPath: 1
                    }
                })
                .sort('-createdAt')
                .skip(startIndex)
                .limit(pageLimit)
                .exec()

            result.rowsPerPage = pageLimit

            for (let i = 0; i < result.data.length; i++) {
                let blog = result.data[i]
                blog.title = toTitleCase(blog.title)
                blog.category = toTitleCase(blog.category)
                if (blog.image) {
                    blog.image.httpPath = API_HOST + UPLOADS_SHORT_URL + String(blog.image._id) + '.' + blog.image.httpPath
                }
                if (blog.video) {
                    blog.video.httpPath = API_HOST + UPLOADS_SHORT_URL + String(blog.video._id) + '.' + blog.video.httpPath
                }
            }

            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get saved post details
     */
    public async getPostDetails(req: Request): Promise<Post | Error> {
        const postId = req.params.postId
        const post = await PostModel.findOne({
            _id: postId,
            isDeleted: false
        })
            .populate({
                path: 'author',
                select: {
                    email: 1,
                    firstName: 1,
                    lastName: 1
                }
            })
            .populate({
                path: 'image',
                select: {
                    httpPath: 1
                }
            })
            .populate({
                path: 'video',
                select: {
                    httpPath: 1
                }
            })
            .exec()
        if (!post) {
            throw new HttpException(
                STATUS_CODES.ERROR.NOT_FOUND,
                'Post not found'
            )
        }
        if (post.image) {
            post.image.httpPath = API_HOST + UPLOADS_SHORT_URL + String(post.image._id) + '.' + post.image.httpPath
        }
        if (post.video) {
            post.video.httpPath = API_HOST + UPLOADS_SHORT_URL + String(post.video._id) + '.' + post.video.httpPath
        }
        await PostModel.findByIdAndUpdate(post._id, { numberOfViews: post.numberOfViews + 1 }).exec()
        return post
    }

    /**
     * Update post
     */

    public async updatePost(req: Request): Promise<void | Error> {
        try {
            const userId = req.user._id
            const postId = req.params.postId
            const { body, files } = req
            const title = body.title
            const content = body.content
            const categoryId = body.categoryId
            let imageFile
            let videoFile

            const postImage = files?.postImage as UploadedFile

            if (postImage) {
                // Add post image
                const imageFilePath = saveFile(
                    FILE_STRUCTURE.POST_IMAGE_DIR,
                    postImage as UploadedFile
                )

                const imageArr = postImage.name.split('.')
                const imageExt = imageArr[imageArr.length - 1]
                imageFile = await new FileModel({
                    httpPath: imageExt,
                    dirPath: imageFilePath,
                    name: postImage.name,
                    size: postImage.size,
                    mimetype: postImage.mimetype,
                    uploadedBy: userId
                }).save()
            }

            const postVideo = files?.postVideo as UploadedFile
            if (postVideo) {


                // Add post video
                const videoFilePath = saveFile(
                    FILE_STRUCTURE.POST_VIDEO_DIR,
                    postVideo as UploadedFile
                )

                const videoArr = postVideo.name.split('.')
                const videoExt = videoArr[videoArr.length - 1]
                videoFile = await new FileModel({
                    httpPath: videoExt,
                    dirPath: videoFilePath,
                    name: postVideo.name,
                    size: postVideo.size,
                    mimetype: postVideo.mimetype,
                    uploadedBy: userId
                }).save()
            }

            let imageObject = imageFile ? { image: imageFile._id } : {}
            let videoObject = videoFile ? { video: videoFile._id } : {}

            const category = await CategoryModel.findOne({
                _id: categoryId,
                isDeleted: false
            }).exec()

            if (!category) {
                throw new HttpException(404, "Category not found")
            }

            await PostModel.findByIdAndUpdate(postId, {
                title: toTitleCase(title),
                content,
                category: category.name,
                categoryId,
                ...imageObject,
                ...videoObject,
            }).exec()

        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Delete post
     */
    public async deletePost(req: Request): Promise<void | Error> {
        const postId = req.params.postId
        await PostModel.findByIdAndUpdate(postId, { isDeleted: true }).exec()
    }
}

function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char: string) => char.toUpperCase());
}

export default PostService
