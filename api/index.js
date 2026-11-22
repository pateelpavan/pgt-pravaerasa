// Vercel Serverless Function Entry Point
// All /api/* requests are routed here by vercel.json rewrites
require('dotenv').config();

const app = require('../server/index');

module.exports = app;
