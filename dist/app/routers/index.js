"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const project_routes_1 = require("../modules/project/project.routes");
const skill_routes_1 = require("../modules/skill/skill.routes");
const about_routes_1 = require("../modules/about/about.routes");
const blog_routes_1 = require("../modules/blog/blog.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes
    },
    {
        path: "/project",
        route: project_routes_1.ProjectRoutes
    },
    {
        path: "/skill",
        route: skill_routes_1.SkillRoutes
    },
    {
        path: "/about",
        route: about_routes_1.AboutRoutes
    },
    {
        path: "/blog",
        route: blog_routes_1.BlogRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
