"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = exports.CategoryModel = exports.CategoryController = void 0;
var category_controller_1 = require("@/resources/category/category.controller");
Object.defineProperty(exports, "CategoryController", { enumerable: true, get: function () { return __importDefault(category_controller_1).default; } });
var category_model_1 = require("@/resources/category/category.model");
Object.defineProperty(exports, "CategoryModel", { enumerable: true, get: function () { return __importDefault(category_model_1).default; } });
var category_service_1 = require("@/resources/category/category.service");
Object.defineProperty(exports, "CategoryService", { enumerable: true, get: function () { return __importDefault(category_service_1).default; } });
