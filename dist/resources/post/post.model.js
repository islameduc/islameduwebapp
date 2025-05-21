"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const PostSchema = new mongoose_1.Schema({
    _id: { type: String, default: uuid_1.v4 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    categoryId: { type: String, required: true },
    author: { type: String, ref: 'User', required: true },
    image: { type: String, ref: 'File' },
    video: { type: String, ref: 'File' },
    numberOfViews: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Post', PostSchema);
