module.exports = class extends Error {
  constructor(statusCode, message) {
    super(message);

    this.custom = true;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
};
