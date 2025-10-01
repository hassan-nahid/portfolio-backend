import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { ProjectRoutes } from "../modules/project/project.routes";
import { SkillRoutes } from "../modules/skill/skill.routes";
import { AboutRoutes } from "../modules/about/about.routes";
import { BlogRoutes } from "../modules/blog/blog.routes";



export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/project",
        route: ProjectRoutes
    },
    {
        path: "/skill",
        route: SkillRoutes
    },
    {
        path: "/about",
        route: AboutRoutes
    },
    {
        path: "/blog",
        route: BlogRoutes
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})