"use strict";var _mongoose=require("mongoose"),_app=_interopRequireDefault(require("./app")),_config=require("./config");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}(async()=>{await(0,_mongoose.connect)(_config.url,{useNewUrlParser:!0,useUnifiedTopology:!0,useCreateIndex:!0}),_app.default.listen(_config.port),console.log(`App listening on port ${_config.port}...`)})();