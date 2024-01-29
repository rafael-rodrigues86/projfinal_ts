// const mongoose = require('mongoose');
// const slugify = require('slugify');
// // const User = require('./userModel');
// // const validator = require('validator');

// const tourSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'A tour must have a name'],
//       unique: true,
//       trim: true,
//       maxlength: [40, 'A tour name must have less or equal then 40 characters'],
//       minlength: [10, 'A tour name must have more or equal then 10 characters']
//       // validate: [validator.isAlpha, 'Tour name must only contain characters']
//     },
//     slug: String,
//     duration: {
//       type: Number,
//       required: [true, 'A tour must have a duration']
//     },
//     maxGroupSize: {
//       type: Number,
//       required: [true, 'A tour must have a group size']
//     },
//     difficulty: {
//       type: String,
//       required: [true, 'A tour must have a difficulty'],
//       enum: {
//         values: ['easy', 'medium', 'difficult'],
//         message: 'Difficulty is either: easy, medium, difficult'
//       }
//     },
//     ratingsAverage: {
//       type: Number,
//       default: 4.5,
//       min: [1, 'Rating must be above 1.0'],
//       max: [5, 'Rating must be below 5.0'],
//       set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
//     },
//     ratingsQuantity: {
//       type: Number,
//       default: 0
//     },
//     price: {
//       type: Number,
//       required: [true, 'A tour must have a price']
//     },
//     priceDiscount: {
//       type: Number,
//       validate: {
//         validator: function(val) {
//           // this only points to current doc on NEW document creation
//           return val < this.price;
//         },
//         message: 'Discount price ({VALUE}) should be below regular price'
//       }
//     },
//     summary: {
//       type: String,
//       trim: true,
//       required: [true, 'A tour must have a description']
//     },
//     description: {
//       type: String,
//       trim: true
//     },
//     imageCover: {
//       type: String,
//       required: [true, 'A tour must have a cover image']
//     },
//     images: [String],
//     createdAt: {
//       type: Date,
//       default: Date.now(),
//       select: false
//     },
//     startDates: [Date],
//     secretTour: {
//       type: Boolean,
//       default: false
//     },
//     startLocation: {
//       // GeoJSON
//       type: {
//         type: String,
//         default: 'Point',
//         enum: ['Point']
//       },
//       coordinates: [Number],
//       address: String,
//       description: String
//     },
//     locations: [
//       {
//         type: {
//           type: String,
//           default: 'Point',
//           enum: ['Point']
//         },
//         coordinates: [Number],
//         address: String,
//         description: String,
//         day: Number
//       }
//     ],
//     guides: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//       }
//     ]
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// // tourSchema.index({ price: 1 });
// tourSchema.index({ price: 1, ratingsAverage: -1 });
// tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });

// tourSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// // Virtual populate
// tourSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'tour',
//   localField: '_id'
// });

// // DOCUMENT MIDDLEWARE: runs before .save() and .create()
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// // tourSchema.pre('save', async function(next) {
// //   const guidesPromises = this.guides.map(async id => await User.findById(id));
// //   this.guides = await Promise.all(guidesPromises);
// //   next();
// // });

// // tourSchema.pre('save', function(next) {
// //   console.log('Will save document...');
// //   next();
// // });

// // tourSchema.post('save', function(doc, next) {
// //   console.log(doc);
// //   next();
// // });

// // QUERY MIDDLEWARE
// // tourSchema.pre('find', function(next) {
// tourSchema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordChangedAt'
//   });

//   next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// // AGGREGATION MIDDLEWARE
// // tourSchema.pre('aggregate', function(next) {
// //   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

// //   console.log(this.pipeline());
// //   next();
// // });

// const Tour = mongoose.model('Tour', tourSchema);

// module.exports = Tour;

// ///////////////////////////////////////////////////////////

import mongoose, { Query } from "mongoose";
import slugify from "slugify";
// const User = require('./userModel');
// const validator = require('validator');

interface TourAttrs {
  name: string;
  slug?: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  createdAt?: Date;
  startDates?: Date[];
  secretTour?: boolean;
  startLocation: {
    type: string;
    coordinates: number[];
    address?: string;
    description?: string;
  };
  locations?: Array<{
    type: string;
    coordinates: number[];
    address?: string;
    description?: string;
    day?: number;
  }>;
  guides: mongoose.Types.ObjectId[];
}

interface TourDoc extends mongoose.Document, TourAttrs {
  durationWeeks: number;
}

const tourSchema = new mongoose.Schema<TourDoc>(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
// tourSchema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

tourSchema.pre(/^find/, function(this: mongoose.Query<any, any>, next) {
  this.find({ secretTour: { $ne: true } });

  (this as any).start = Date.now();

  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

tourSchema.post(/^find/, function(
  this: mongoose.Query<any, any> & { start?: number },
  docs,
  next
) {
  if (this.start) {
    const duration = Date.now() - this.start;
    console.log(`Query took ${duration} milliseconds!`);
  }
  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model<TourDoc>("Tour", tourSchema);

export default Tour;
