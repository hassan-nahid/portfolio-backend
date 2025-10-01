import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { ProjectRoutes } from "../modules/project/project.routes";
import { SkillRoutes } from "../modules/skill/skill.routes";



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

   

]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})