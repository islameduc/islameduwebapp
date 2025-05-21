"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("@/resources/file");
const category_1 = require("@/resources/category");
const post_1 = require("@/resources/post");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const constants_1 = require("@/utils/helper/constants");
const utils_1 = require("@/utils/helper/utils");
class CategoryService {
    /**
     * Add a new category
     */
    addCategory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const { body, files } = req;
                const name = toTitleCase(body.name);
                const description = body.description;
                let imageFile;
                const existingCategory = yield category_1.CategoryModel.findOne({
                    name,
                    isDeleted: false
                }).exec();
                if (existingCategory) {
                    throw new http_exception_1.default(409, `A category already exists with the name ${name}`);
                }
                const categoryImage = files === null || files === void 0 ? void 0 : files.categoryImage;
                if (categoryImage) {
                    // Add category image
                    const imageFilePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.CATEGORY_IMAGE_DIR, categoryImage);
                    const imageArr = categoryImage.name.split('.');
                    const imageExt = imageArr[imageArr.length - 1];
                    imageFile = yield new file_1.FileModel({
                        httpPath: imageExt,
                        dirPath: imageFilePath,
                        name: categoryImage.name,
                        size: categoryImage.size,
                        mimetype: categoryImage.mimetype,
                        uploadedBy: userId
                    }).save();
                }
                let imageObject = imageFile ? { image: imageFile._id } : {};
                const category = yield new category_1.CategoryModel(Object.assign({ name,
                    description }, imageObject)).save();
                return category;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get saved categories
     */
    getCategories(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield category_1.CategoryModel.find({ isDeleted: false })
                .populate({
                path: 'image',
                select: {
                    httpPath: 1
                }
            })
                .sort('name')
                .exec();
            for (let i = 0; i < categories.length; i++) {
                let category = categories[i];
                if (category.image) {
                    category.image.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(category.image._id) + '.' + category.image.httpPath;
                }
            }
            return categories;
        });
    }
    /**
     * Get saved category posts
     */
    getCategoryPosts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = req.params.categoryId;
            const pageNumber = parseInt(req.query.pageNumber) ||
                constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
            const pageLimit = parseInt(req.query.limit) ||
                constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
            try {
                const startIndex = pageNumber * pageLimit;
                const endIndex = (pageNumber + 1) * pageLimit;
                const result = {
                    total: 0,
                    data: [],
                    rowsPerPage: 0,
                };
                result.total = yield post_1.PostModel.find({
                    categoryId,
                    isDeleted: false
                })
                    .countDocuments()
                    .exec();
                // Check if previous page exists and give page number
                if (startIndex > 0) {
                    result.previous = {
                        pageNumber: pageNumber - 1,
                        pageLimit,
                    };
                }
                // Check if next page exists and give page number
                if (endIndex < result.total) {
                    result.next = {
                        pageNumber: pageNumber + 1,
                        pageLimit,
                    };
                }
                result.data = yield post_1.PostModel.find({
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
                    .exec();
                result.rowsPerPage = pageLimit;
                for (let i = 0; i < result.data.length; i++) {
                    let blog = result.data[i];
                    if (blog.image) {
                        blog.image.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(blog.image._id) + '.' + blog.image.httpPath;
                    }
                    if (blog.video) {
                        blog.video.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(blog.video._id) + '.' + blog.video.httpPath;
                    }
                }
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Update category
     */
    updateCategory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            const categoryId = req.params.categoryId;
            try {
                const { body, files } = req;
                const name = toTitleCase(body.name);
                const description = body.description;
                let imageFile;
                const existingCategory = yield category_1.CategoryModel.findOne({
                    name,
                    isDeleted: false
                }).exec();
                if (existingCategory && existingCategory._id != categoryId) {
                    throw new http_exception_1.default(409, `A category already exists with the name ${name}`);
                }
                const categoryImage = files === null || files === void 0 ? void 0 : files.categoryImage;
                if (categoryImage) {
                    // Add category image
                    const imageFilePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.CATEGORY_IMAGE_DIR, categoryImage);
                    const imageArr = categoryImage.name.split('.');
                    const imageExt = imageArr[imageArr.length - 1];
                    imageFile = yield new file_1.FileModel({
                        httpPath: imageExt,
                        dirPath: imageFilePath,
                        name: categoryImage.name,
                        size: categoryImage.size,
                        mimetype: categoryImage.mimetype,
                        uploadedBy: userId
                    }).save();
                }
                let imageObject = imageFile ? { image: imageFile._id } : {};
                yield category_1.CategoryModel.findByIdAndUpdate(categoryId, Object.assign({ name,
                    description }, imageObject)).exec();
                const posts = yield post_1.PostModel.find({ categoryId }).exec();
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i];
                    yield post_1.PostModel.findByIdAndUpdate(post._id, { category: name });
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Delete category
     */
    deleteCategoryById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = req.params.categoryId;
            const posts = yield post_1.PostModel.find({
                categoryId,
                isDeleted: false
            }).exec();
            for (let i = 0; i < posts.length; i++) {
                let post = posts[i];
                yield post_1.PostModel.findByIdAndUpdate(post._id, { isDeleted: true }).exec();
            }
            yield category_1.CategoryModel.findByIdAndUpdate(categoryId, { isDeleted: true });
        });
    }
}
function toTitleCase(str) {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
exports.default = CategoryService;
