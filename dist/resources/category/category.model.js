"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const CategorySchema = new mongoose_1.Schema({
    _id: { type: String, default: uuid_1.v4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, ref: 'File' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Category', CategorySchema);
