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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlogFormData = exports.validateFormData = void 0;
const zod_1 = require("zod");
// Custom validation middleware for form-data with multer
const validateFormData = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse and validate the request body
        const validatedData = yield schema.parseAsync(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.validateFormData = validateFormData;
// Blog form data validation schema
const blogFormDataSchema = zod_1.z.object({
    title: zod_1.z.string({
        message: "Blog title is required"
    }).min(5, "Title must be at least 5 characters long").max(200, "Title cannot exceed 200 characters"),
    excerpt: zod_1.z.string({
        message: "Blog excerpt is required"
    }).min(20, "Excerpt must be at least 20 characters long").max(500, "Excerpt cannot exceed 500 characters"),
    content: zod_1.z.string({
        message: "Blog content is required"
    }).min(100, "Content must be at least 100 characters long").max(50000, "Content cannot exceed 50,000 characters"),
    category: zod_1.z.string().refine((val) => {
        const validCategories = ["Technology", "Web Development", "Programming", "Tutorial", "Personal", "Other"];
        return validCategories.includes(val);
    }, {
        message: "Please select a valid blog category (Technology, Web Development, Programming, Tutorial, Personal, Other)"
    }),
    tags: zod_1.z.union([
        zod_1.z.array(zod_1.z.string()),
        zod_1.z.string().transform((str) => {
            try {
                const parsed = JSON.parse(str);
                if (Array.isArray(parsed))
                    return parsed;
                return [str];
            }
            catch (_a) {
                return str.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
        })
    ]).refine((tags) => Array.isArray(tags) && tags.length >= 1 && tags.length <= 10, {
        message: "Must have 1-10 tags"
    }),
    status: zod_1.z.string().refine((val) => {
        const validStatuses = ["draft", "published", "archived"];
        return validStatuses.includes(val.toLowerCase());
    }, {
        message: "Status must be: draft, published, or archived"
    }).transform(val => val.toLowerCase()).optional().default("published"),
    isFeature: zod_1.z.union([
        zod_1.z.boolean(),
        zod_1.z.string().transform((val) => val === 'true' || val === '1' || val === 'yes')
    ]).optional().default(false)
});
exports.validateBlogFormData = (0, exports.validateFormData)(blogFormDataSchema);
