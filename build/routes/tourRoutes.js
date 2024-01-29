"use strict";
// const express = require("express");
// const tourController = require("./../controllers/tourController");
// const authController = require("./../controllers/authController");
// const reviewRouter = require("./../routes/reviewRoutes");
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
// const router = express.Router();
// // router.param('id', tourController.checkID);
// // POST /tour/234fad4/reviews
// // GET /tour/234fad4/reviews
// router.use("/:tourId/reviews", reviewRouter);
// router
//   .route("/top-5-cheap")
//   .get(tourController.aliasTopTours, tourController.getAllTours);
// router.route("/tour-stats").get(tourController.getTourStats);
// router
//   .route("/monthly-plan/:year")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide", "guide"),
//     tourController.getMonthlyPlan
//   );
// router
//   .route("/tours-within/:distance/center/:latlng/unit/:unit")
//   .get(tourController.getToursWithin);
// // /tours-within?distance=233&center=-40,45&unit=mi
// // /tours-within/233/center/-40,45/unit/mi
// router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);
// router
//   .route("/")
//   .get(tourController.getAllTours)
//   .post(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide"),
//     tourController.createTour
//   );
// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide"),
//     tourController.updateTour
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide"),
//     tourController.deleteTour
//   );
// module.exports = router;
const express_1 = __importDefault(require("express"));
const tourController = __importStar(require("../controllers/tourController"));
const authController = __importStar(require("../controllers/authController"));
const reviewRoutes_1 = __importDefault(require("../routes/reviewRoutes"));
const router = express_1.default.Router();
// router.param('id', tourController.checkID);
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
router.use("/:tourId/reviews", reviewRoutes_1.default);
router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTours);
router.route("/tour-stats").get(tourController.getTourStats);
router
    .route("/monthly-plan/:year")
    .get(authController.protect, authController.restrictTo("admin", "lead-guide", "guide"), tourController.getMonthlyPlan);
router
    .route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);
router
    .route("/")
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo("admin", "lead-guide"), tourController.createTour);
router
    .route("/:id")
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo("admin", "lead-guide"), tourController.updateTour)
    .delete(authController.protect, authController.restrictTo("admin", "lead-guide"), tourController.deleteTour);
exports.default = router;
