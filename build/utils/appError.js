"use strict";
// class AppError extends Error {
//   constructor(message, statusCode) {
//     super(message);
Object.defineProperty(exports, "__esModule", { value: true });
//     this.statusCode = statusCode;
//     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//     this.isOperational = true;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }
// module.exports = AppError;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Chama o construtor da classe Error
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
