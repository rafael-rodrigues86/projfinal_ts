"use strict";
// const Tour = require("../models/tourModel");
// const User = require("../models/userModel");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");
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
exports.updateUserData = exports.getAccount = exports.getLoginForm = exports.getTour = exports.getOverview = void 0;
// exports.getOverview = catchAsync(async (req, res, next) => {
//   // 1) Get tour data from collection
//   const tours = await Tour.find();
//   // 2) Build template
//   // 3) Render that template using tour data from 1)
//   // Aqui, vamos pegar todas as informações desse endpoint e vamos renderiza-los de acordo com o overview template
//   res.status(200).render("overview", {
//     title: "All Tours",
//     tours,
//   });
// });
// exports.getTour = catchAsync(async (req, res, next) => {
//   // 1) Get the data, for the requested tour (including reviews and guides)
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: "reviews",
//     fields: "review rating user",
//   });
//   if (!tour) {
//     return next(new AppError("There is no tour with that name.", 404));
//   }
//   // 2) Build template
//   // 3) Render template using data from 1)
//   res.status(200).render("tour", {
//     title: `${tour.name} Tour`,
//     tour,
//   });
// });
// exports.getLoginForm = (req, res) => {
//   res.status(200).render("login", {
//     title: "Log into your account",
//   });
// };
// exports.getAccount = (req, res) => {
//   res.status(200).render("account", {
//     title: "Your account",
//   });
// };
// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).render("account", {
//     title: "Your account",
//     user: updatedUser,
//   });
// });
// ///////////////////////////////////////////////
const tourModel_1 = __importDefault(require("../models/tourModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
exports.getOverview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get tour data from collection
    const tours = yield tourModel_1.default.find();
    // 2) Build template
    // 3) Render that template using tour data from 1)
    // Aqui, vamos pegar todas as informações desse endpoint e vamos renderiza-los de acordo com o overview template
    res.status(200).render("overview", {
        title: "All Tours",
        tours,
    });
}));
exports.getTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = yield tourModel_1.default.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user",
    });
    if (!tour) {
        return next(new appError_1.default("There is no tour with that name.", 404));
    }
    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour,
    });
}));
const getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Log into your account",
    });
};
exports.getLoginForm = getLoginForm;
const getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "Your account",
    });
};
exports.getAccount = getAccount;
exports.updateUserData = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, {
        name: req.body.name,
        email: req.body.email,
    }, {
        new: true,
        runValidators: true,
    });
    res.status(200).render("account", {
        title: "Your account",
        user: updatedUser,
    });
}));
