"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategory = exports.BlogStatus = void 0;
// Blog status enum
var BlogStatus;
(function (BlogStatus) {
    BlogStatus["DRAFT"] = "draft";
    BlogStatus["PUBLISHED"] = "published";
    BlogStatus["ARCHIVED"] = "archived";
})(BlogStatus || (exports.BlogStatus = BlogStatus = {}));
// Blog category enum
var BlogCategory;
(function (BlogCategory) {
    BlogCategory["TECHNOLOGY"] = "Technology";
    BlogCategory["WEB_DEVELOPMENT"] = "Web Development";
    BlogCategory["PROGRAMMING"] = "Programming";
    BlogCategory["TUTORIAL"] = "Tutorial";
    BlogCategory["PERSONAL"] = "Personal";
    BlogCategory["OTHER"] = "Other";
})(BlogCategory || (exports.BlogCategory = BlogCategory = {}));
