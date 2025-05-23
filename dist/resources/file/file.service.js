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
const constants_1 = require("@/utils/helper/constants");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
class ProjectService {
    /**
     * Get a file by it's id
     */
    getFile(req, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileId = req.params.fileId;
                let fileIdParts = fileId.split('.');
                const file = yield file_1.FileModel.findOne(isAdmin ? { _id: fileIdParts[0] } : { _id: fileIdParts[0], deleted: false }).exec();
                if (!file) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'File not found');
                }
                return file;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get saved files
     */
    getFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield file_1.FileModel.find().exec();
                for (let i = 0; i < result.length; i++) {
                    let file = result[i];
                    file.dirPath = undefined;
                    file.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + 'admin/' + String(file._id) + '.' + file.httpPath;
                }
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
}
exports.default = ProjectService;
