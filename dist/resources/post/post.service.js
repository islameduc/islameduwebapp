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
const post_1 = require("@/resources/post");
const category_1 = require("@/resources/category");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const constants_1 = require("@/utils/helper/constants");
const utils_1 = require("@/utils/helper/utils");
class PostService {
    /**
     * Add a new post
     */
    addPost(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const { body, files } = req;
                const title = body.title;
                const content = body.content;
                const categoryId = body.categoryId;
                let imageFile;
                let videoFile;
                const postImage = files === null || files === void 0 ? void 0 : files.postImage;
                if (postImage) {
                    // Add post image
                    const imageFilePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.POST_IMAGE_DIR, postImage);
                    const imageArr = postImage.name.split('.');
                    const imageExt = imageArr[imageArr.length - 1];
                    imageFile = yield new file_1.FileModel({
                        httpPath: imageExt,
                        dirPath: imageFilePath,
                        name: postImage.name,
                        size: postImage.size,
                        mimetype: postImage.mimetype,
                        uploadedBy: userId
                    }).save();
                }
                const postVideo = files === null || files === void 0 ? void 0 : files.postVideo;
                if (postVideo) {
                    // Add post video
                    const videoFilePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.POST_VIDEO_DIR, postVideo);
                    const videoArr = postVideo.name.split('.');
                    const videoExt = videoArr[videoArr.length - 1];
                    videoFile = yield new file_1.FileModel({
                        httpPath: videoExt,
                        dirPath: videoFilePath,
                        name: postVideo.name,
                        size: postVideo.size,
                        mimetype: postVideo.mimetype,
                        uploadedBy: userId
                    }).save();
                }
                let imageObject = imageFile ? { image: imageFile._id } : {};
                let videoObject = videoFile ? { video: videoFile._id } : {};
                const category = yield category_1.CategoryModel.findOne({
                    _id: categoryId,
                    isDeleted: false
                }).exec();
                if (!category) {
                    throw new http_exception_1.default(404, "Category not found");
                }
                const post = yield new post_1.PostModel(Object.assign(Object.assign({ title: toTitleCase(title), content, category: category.name, categoryId, author: userId }, imageObject), videoObject)).save();
                return post;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get saved posts
     */
    getAllPosts(req) {
        return __awaiter(this, void 0, void 0, function* () {
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
                result.total = yield post_1.PostModel.find({ isDeleted: false })
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
                result.data = yield post_1.PostModel.find({ isDeleted: false })
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
                    blog.title = toTitleCase(blog.title);
                    blog.category = toTitleCase(blog.category);
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
     * Get saved post details
     */
    getPostDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            const post = yield post_1.PostModel.findOne({
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
                .exec();
            if (!post) {
                throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Post not found');
            }
            if (post.image) {
                post.image.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(post.image._id) + '.' + post.image.httpPath;
            }
            if (post.video) {
                post.video.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(post.video._id) + '.' + post.video.httpPath;
            }
            yield post_1.PostModel.findByIdAndUpdate(post._id, { numberOfViews: post.numberOfViews + 1 }).exec();
            return post;
        });
    }
    /**
     * Update post
     */
    updatePost(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const postId = req.params.postId;
                const { body, files } = req;
                const title = body.title;
                const content = body.content;
                const categoryId = body.categoryId;
                let imageFile;
                let videoFile;
                const postImage = files === null || files === void 0 ? void 0 : files.postImage;
                if (postImage) {
                    // Add post image
                    const imageFilePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.POST_IMAGE_DIR, postImage);
                    const imageArr = postImage.name.split('.');
                    const imageExt = imageArr[imageArr.length - 1];
                    imageFile = yield new file_1.FileModel({
                        httpPath: imageExt,
                        dirPath: imageFilePath,
                        name: postImage.name,
                        size: postImage.size,
                        mimetype: postImage.mimetype,
                        uploadedBy: userId
                    }).save();
                }
                const postVideo = files === null || files === void 0 ? void 0 : files.postVideo;
                if (postVideo) {
                    // Add post video
                    const videoFilePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.POST_VIDEO_DIR, postVideo);
                    const videoArr = postVideo.name.split('.');
                    const videoExt = videoArr[videoArr.length - 1];
                    videoFile = yield new file_1.FileModel({
                        httpPath: videoExt,
                        dirPath: videoFilePath,
                        name: postVideo.name,
                        size: postVideo.size,
                        mimetype: postVideo.mimetype,
                        uploadedBy: userId
                    }).save();
                }
                let imageObject = imageFile ? { image: imageFile._id } : {};
                let videoObject = videoFile ? { video: videoFile._id } : {};
                const category = yield category_1.CategoryModel.findOne({
                    _id: categoryId,
                    isDeleted: false
                }).exec();
                if (!category) {
                    throw new http_exception_1.default(404, "Category not found");
                }
                yield post_1.PostModel.findByIdAndUpdate(postId, Object.assign(Object.assign({ title: toTitleCase(title), content, category: category.name, categoryId }, imageObject), videoObject)).exec();
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Delete post
     */
    deletePost(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            yield post_1.PostModel.findByIdAndUpdate(postId, { isDeleted: true }).exec();
        });
    }
}
function toTitleCase(str) {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
exports.default = PostService;
