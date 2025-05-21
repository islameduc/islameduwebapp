"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const DetailSchema = new mongoose_1.Schema({
    _id: { type: String, default: uuid_1.v4 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Detail', DetailSchema);
