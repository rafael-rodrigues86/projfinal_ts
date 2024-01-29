"use strict";
// // review / rating / createdAt / ref to tour / ref to user
// const mongoose = require('mongoose');
// const Tour = require('./tourModel');
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
// const reviewSchema = new mongoose.Schema(
//   {
//     review: {
//       type: String,
//       required: [true, 'Review can not be empty!']
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     },
//     tour: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Tour',
//       required: [true, 'Review must belong to a tour.']
//     },
//     user: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: [true, 'Review must belong to a user']
//     }
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );
// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
// reviewSchema.pre(/^find/, function(next) {
//   // this.populate({
//   //   path: 'tour',
//   //   select: 'name'
//   // }).populate({
//   //   path: 'user',
//   //   select: 'name photo'
//   // });
//   this.populate({
//     path: 'user',
//     select: 'name photo'
//   });
//   next();
// });
// reviewSchema.statics.calcAverageRatings = async function(tourId) {
//   const stats = await this.aggregate([
//     {
//       $match: { tour: tourId }
//     },
//     {
//       $group: {
//         _id: '$tour',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' }
//       }
//     }
//   ]);
//   // console.log(stats);
//   if (stats.length > 0) {
//     await Tour.findByIdAndUpdate(tourId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating
//     });
//   } else {
//     await Tour.findByIdAndUpdate(tourId, {
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5
//     });
//   }
// };
// reviewSchema.post('save', function() {
//   // this points to current review
//   this.constructor.calcAverageRatings(this.tour);
// });
// // findByIdAndUpdate
// // findByIdAndDelete
// reviewSchema.pre(/^findOneAnd/, async function(next) {
//   this.r = await this.findOne();
//   // console.log(this.r);
//   next();
// });
// reviewSchema.post(/^findOneAnd/, async function() {
//   // await this.findOne(); does NOT work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });
// const Review = mongoose.model('Review', reviewSchema);
// module.exports = Review;
// ///////////////////////////////////////////////////////////////////
// review / rating / createdAt / ref to tour / ref to user
const mongoose_1 = __importDefault(require("mongoose"));
const tourModel_1 = __importDefault(require("./tourModel"));
const reviewSchema = new mongoose_1.default.Schema({
    review: {
        type: String,
        required: [true, "Review can not be empty!"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tour: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour."],
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //   path: 'tour',
    //   select: 'name'
    // }).populate({
    //   path: 'user',
    //   select: 'name photo'
    // });
    this.populate({
        path: "user",
        select: "name photo",
    });
    next();
});
reviewSchema.statics.calcAverageRatings = function (tourId) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield this.aggregate([
            {
                $match: { tour: tourId },
            },
            {
                $group: {
                    _id: "$tour",
                    nRating: { $sum: 1 },
                    avgRating: { $avg: "$rating" },
                },
            },
        ]);
        // console.log(stats);
        if (stats.length > 0) {
            yield tourModel_1.default.findByIdAndUpdate(tourId, {
                ratingsQuantity: stats[0].nRating,
                ratingsAverage: stats[0].avgRating,
            });
        }
        else {
            yield tourModel_1.default.findByIdAndUpdate(tourId, {
                ratingsQuantity: 0,
                ratingsAverage: 4.5,
            });
        }
    });
};
// reviewSchema.post<ReviewDoc>("save", function() {
//   this.constructor.calcAverageRatings(this.tour);
// });
reviewSchema.post("save", function () {
    const model = this.constructor;
    // @ts-ignore
    model.calcAverageRatings(this.tour);
});
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        this.r = yield this.findOne();
        next();
    });
});
reviewSchema.post(/^findOneAnd/, function () {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        yield this.r.constructor.calcAverageRatings(this.r.tour);
    });
});
const Review = mongoose_1.default.model("Review", reviewSchema);
exports.default = Review;
