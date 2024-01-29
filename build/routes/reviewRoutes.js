"use strict";
// const express = require('express');
// const reviewController = require('./../controllers/reviewController');
// const authController = require('./../controllers/authController');
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router({ mergeParams: true });
// router.use(authController.protect);
// router
//   .route('/')
//   .get(reviewController.getAllReviews)
//   .post(
//     authController.restrictTo('user'),
//     reviewController.setTourUserIds,
//     reviewController.createReview
//   );
// router
//   .route('/:id')
//   .get(reviewController.getReview)
//   .patch(
//     authController.restrictTo('user', 'admin'),
//     reviewController.updateReview
//   )
//   .delete(
//     authController.restrictTo('user', 'admin'),
//     reviewController.deleteReview
//   );
// module.exports = router;
// /////////////////////////////////////
const express_1 = __importDefault(require("express"));
const reviewController = __importStar(require("./../controllers/reviewController"));
const authController = __importStar(require("./../controllers/authController"));
const router = express_1.default.Router({ mergeParams: true });
router.use(authController.protect);
router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo("user"), reviewController.setTourUserIds, reviewController.createReview);
router
    .route("/:id")
    .get(reviewController.getReview)
    .patch(authController.restrictTo("user", "admin"), reviewController.updateReview)
    .delete(authController.restrictTo("user", "admin"), reviewController.deleteReview);
exports.default = router;
