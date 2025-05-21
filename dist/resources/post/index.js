"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.PostService = exports.PostModel = exports.PostController = void 0;
var post_controller_1 = require("@/resources/post/post.controller");
Object.defineProperty(exports, "PostController", { enumerable: true, get: function () { return __importDefault(post_controller_1).default; } });
var post_model_1 = require("@/resources/post/post.model");
Object.defineProperty(exports, "PostModel", { enumerable: true, get: function () { return __importDefault(post_model_1).default; } });
var post_service_1 = require("@/resources/post/post.service");
Object.defineProperty(exports, "PostService", { enumerable: true, get: function () { return __importDefault(post_service_1).default; } });
var post_validation_1 = require("@/resources/post/post.validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return __importDefault(post_validation_1).default; } });
