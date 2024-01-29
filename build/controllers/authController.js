"use strict";
// const crypto = require('crypto');
// const { promisify } = require('util');
// const jwt = require('jsonwebtoken');
// const User = require('./../models/userModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
// const sendEmail = require('./../utils/email');
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
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.isLoggedIn = exports.protect = exports.logout = exports.login = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("./../models/userModel"));
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const appError_1 = __importDefault(require("./../utils/appError"));
const email_1 = __importDefault(require("./../utils/email"));
const jwtsecret = process.env.JWT_SECRET;
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, jwtsecret, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
// @ts-ignore
const jwtCookiesExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + jwtCookiesExpiresIn * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, res);
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new appError_1.default("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = yield userModel_1.default.findOne({ email }).select("+password");
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new appError_1.default("Incorrect email or password", 401));
    }
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
}));
const logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
exports.logout = logout;
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Getting token and check of it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError_1.default("You are not logged in! Please log in to get access.", 401));
    }
    // 2) Verification token
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    let decoded;
    if (process.env.JWT_SECRET) {
        decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    else {
        return next(new appError_1.default("JWT secret is not defined.", 500));
    }
    // 3) Check if user still exists
    const currentUser = yield userModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.default("The user belonging to this token does no longer exist.", 401));
    }
    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default("User recently changed password! Please log in again.", 401));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
}));
// Only for rendered pages, no errors!
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            // const decoded = await promisify(jwt.verify)(
            //   req.cookies.jwt,
            //   process.env.JWT_SECRET
            // );
            let decoded;
            if (process.env.JWT_SECRET) {
                decoded = yield jsonwebtoken_1.default.verify(req.cookies.jwt, process.env.JWT_SECRET);
            }
            else {
                return next(new appError_1.default("JWT secret is not defined.", 500));
            }
            // 2) Check if user still exists
            const currentUser = yield userModel_1.default.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
});
exports.isLoggedIn = isLoggedIn;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        const userRole = req.user.role;
        if (!roles.includes(userRole)) {
            return next(new appError_1.default("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on POSTed email
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default("There is no user with email address.", 404));
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        yield (0, email_1.default)({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Token sent to email!",
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new appError_1.default("There was an error sending the email. Try again later!", 500));
    }
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        // @ts-ignore
        passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new appError_1.default("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
}));
exports.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user from collection
    const userId = req.user.id;
    const user = yield userModel_1.default.findById(userId).select("+password");
    // 2) Check if POSTed current password is correct
    if (!(yield user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new appError_1.default("Your current password is wrong.", 401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    yield user.save();
    // User.findByIdAndUpdate will NOT work as intended!
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
}));
