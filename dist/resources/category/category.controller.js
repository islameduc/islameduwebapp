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
const category_1 = require("@/resources/category");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const constants_1 = require("@/utils/helper/constants");
class CategoryController {
    constructor() {
        this.path = '/categories';
        this.router = (0, express_1.Router)();
        this.categoryService = new category_1.CategoryService();
        this.initializeRoutes = () => {
            this.router.post(`${this.path}/add-category`, [index_1.authJwt.isSuperAdmin], this.addCategory);
            this.router.get(this.path, this.getCategories);
            this.router.get(`${this.path}/:categoryId`, this.getCategoryPosts);
            this.router.patch(`${this.path}/:categoryId`, [index_1.authJwt.isSuperAdmin], this.updateCategory);
            this.router.delete(`${this.path}/:categoryId`, [index_1.authJwt.isSuperAdmin], this.deleteCategoryById);
        };
        this.addCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newCategory = yield this.categoryService.addCategory(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Category added successfully',
                    newPost: newCategory
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.categoryService.getCategories(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getCategoryPosts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.categoryService.getCategoryPosts(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(posts);
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.updateCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.categoryService.updateCategory(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                    .json({ "message": "Category updated successfully" });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteCategoryById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.categoryService.deleteCategoryById(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST)
                    .json({ "message": "Category deleted successfully" });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.initializeRoutes();
    }
}
exports.default = CategoryController;
