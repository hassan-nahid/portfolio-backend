import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/CatchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service"
import { setAuthCookie } from "../../utils/setCookie"
import AppError from "../../errorHelpers/AppError"
import { JwtPayload } from "jsonwebtoken"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)
    console.log(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    })
})




const credentialsLogin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const loginInfo = await UserServices.credentialsLogin(req.body);

        setAuthCookie(res, {
            accessToken: loginInfo.accessToken,
            refreshToken: loginInfo.refreshToken,
        });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: loginInfo,
        });
    }
);

export const AuthController = {
    credentialsLogin,
};

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }
    const tokenInfo = await UserServices.getNewAccessToken(refreshToken as string)

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { oldPassword, newPassword } = req.body
    const decodedToken = req.user

    await UserServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const user = await UserServices.getMe(decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: user
    })
})

export const Usercontrollers = {
    createUser,
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    getMe
}