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
const express_1 = require("express");
const index_1 = require("@/middleware/index");
const post_1 = require("@/resources/post");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const constants_1 = require("@/utils/helper/constants");
class PostController {
    constructor() {
        this.path = '/posts';
        this.router = (0, express_1.Router)();
        this.postService = new post_1.PostService();
        this.initializeRoutes = () => {
            this.router.post(`${this.path}/add-post`, [index_1.authJwt.isSuperAdmin], this.addPost);
            this.router.get(`${this.path}/all`, this.getAllPosts);
            this.router.get(`${this.path}/:postId`, this.getPostDetails);
            this.router.patch(`${this.path}/:postId`, [index_1.authJwt.isSuperAdmin], this.updatePost);
            this.router.delete(`${this.path}/:postId`, [index_1.authJwt.isSuperAdmin], this.deletePost);
        };
        this.addPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newPost = yield this.postService.addPost(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Post added successfully',
                    newPost
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getAllPosts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.postService.getAllPosts(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getPostDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield this.postService.getPostDetails(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(project);
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.updatePost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postService.updatePost(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                    .json({ "message": "Post updated successfully" });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deletePost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postService.deletePost(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                    .json({ "message": "Post deleted successfully" });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.initializeRoutes();
    }
}
exports.default = PostController;
