// const Review = require("./../models/reviewModel");
// const factory = require("./handlerFactory");

// import { Request, Response, NextFunction } from "express";
// // const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req: Request, res: Response, next: NextFunction) => {
//   // Allow nested routes
//   const userId = (req as any).user.id;

//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = userId;
//   next();
// };

// exports.getAllReviews = factory.getAll(Review);
// exports.getReview = factory.getOne(Review);
// exports.createReview = factory.createOne(Review);
// exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review);

// ///////////////////////////////////

import Review from "./../models/reviewModel";
import * as factory from "./handlerFactory";
import { Request, Response, NextFunction } from "express";

export const setTourUserIds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Allow nested routes
  const userId = (req as any).user.id;

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = userId;
  next();
};

export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
