import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'

import { FileModel } from '@/resources/file'
import { Category, CategoryModel } from '@/resources/category'
import { PostModel } from '@/resources/post'
import { paginationResult } from '@/utils/definitions/custom'
import HttpException from '@/utils/exceptions/http.exception'
import {
    API_HOST,
    FILE_STRUCTURE,
    PAGINATION,
    STATUS_CODES,
    UPLOADS_SHORT_URL
} from '@/utils/helper/constants'
import { saveFile } from '@/utils/helper/utils'

class CategoryService {
    /**
     * Add a new category
     */
    public async addCategory(req: Request): Promise<Category | Error> {
        try {
            const userId = req.user._id
            const { body, files } = req
            const name = toTitleCase(body.name)
            const description = body.description
            let imageFile

            const existingCategory = await CategoryModel.findOne({
                name,
                isDeleted: false
            }).exec()

            if (existingCategory) {
                throw new HttpException(409, `A category already exists with the name ${name}`)
            }

            const categoryImage = files?.categoryImage as UploadedFile

            if (categoryImage) {
                // Add category image
                const imageFilePath = saveFile(
                    FILE_STRUCTURE.CATEGORY_IMAGE_DIR,
                    categoryImage as UploadedFile
                )

                const imageArr = categoryImage.name.split('.')
                const imageExt = imageArr[imageArr.length - 1]
                imageFile = await new FileModel({
                    httpPath: imageExt,
                    dirPath: imageFilePath,
                    name: categoryImage.name,
                    size: categoryImage.size,
                    mimetype: categoryImage.mimetype,
                    uploadedBy: userId
                }).save()
            }

            let imageObject = imageFile ? { image: imageFile._id } : {}

            const category = await new CategoryModel({
                name,
                description,
                ...imageObject,
            }).save()

            return category

        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get saved categories
     */
    public async getCategories(req: Request): Promise<Category[] | Error> {
        const categories = await CategoryModel.find({ isDeleted: false })
            .populate({
                path: 'image',
                select: {
                    httpPath: 1
                }
            })
            .sort('name')
            .exec()

        for (let i = 0; i < categories.length; i++) {
            let category = categories[i]
            if (category.image) {
                category.image.httpPath = API_HOST + UPLOADS_SHORT_URL + String(category.image._id) + '.' + category.image.httpPath
            }
        }

        return categories
    }

    /**
     * Get saved category posts
     */
    public async getCategoryPosts(req: Request): Promise<paginationResult | Error> {
        const categoryId = req.params.categoryId
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
            result.total = await PostModel.find({
                categoryId,
                isDeleted: false
            })
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

            result.data = await PostModel.find({
                categoryId,
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
                .sort('-createdAt')
                .skip(startIndex)
                .limit(pageLimit)
                .exec()

            result.rowsPerPage = pageLimit

            for (let i = 0; i < result.data.length; i++) {
                let blog = result.data[i]
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
     * Update category
     */
    public async updateCategory(req: Request): Promise<void | Error> {
        const userId = req.user._id
        const categoryId = req.params.categoryId
        try {
            const { body, files } = req
            const name = toTitleCase(body.name)
            const description = body.description
            let imageFile

            const existingCategory = await CategoryModel.findOne({
                name,
                isDeleted: false
            }).exec()

            if (existingCategory && existingCategory._id != categoryId) {
                throw new HttpException(409, `A category already exists with the name ${name}`)
            }

            const categoryImage = files?.categoryImage as UploadedFile

            if (categoryImage) {
                // Add category image
                const imageFilePath = saveFile(
                    FILE_STRUCTURE.CATEGORY_IMAGE_DIR,
                    categoryImage as UploadedFile
                )

                const imageArr = categoryImage.name.split('.')
                const imageExt = imageArr[imageArr.length - 1]
                imageFile = await new FileModel({
                    httpPath: imageExt,
                    dirPath: imageFilePath,
                    name: categoryImage.name,
                    size: categoryImage.size,
                    mimetype: categoryImage.mimetype,
                    uploadedBy: userId
                }).save()
            }

            let imageObject = imageFile ? { image: imageFile._id } : {}

            await CategoryModel.findByIdAndUpdate(categoryId, {
                name,
                description,
                ...imageObject,
            }).exec()

            const posts = await PostModel.find({ categoryId }).exec()
            for (let i = 0; i < posts.length; i++) {
                let post = posts[i]
                await PostModel.findByIdAndUpdate(post._id, { category: name })
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Delete category
     */
    public async deleteCategoryById(req: Request): Promise<void | Error> {
        const categoryId = req.params.categoryId
        const posts = await PostModel.find({
            categoryId,
            isDeleted: false
        }).exec()
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i]
            await PostModel.findByIdAndUpdate(post._id, { isDeleted: true }).exec()
        }
        await CategoryModel.findByIdAndUpdate(categoryId, { isDeleted: true })
    }
}

function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char: string) => char.toUpperCase());
}

export default CategoryService
