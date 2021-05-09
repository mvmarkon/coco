"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _express=_interopRequireDefault(require("express")),_path=require("path"),_items=_interopRequireDefault(require("./items/items.controller")),_users=_interopRequireDefault(require("./users/users.controller")),_events=_interopRequireDefault(require("./events/events.controller")),_protocols=_interopRequireDefault(require("./protocols/protocols.controller"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}// Create the express application
const app=(0,_express.default)();// Assign controllers to routes
app.use("/api/items",_items.default),app.use("/api/users",_users.default),app.use("/api/events",_events.default),app.use("/api/protocols",_protocols.default),app.use(_express.default.static((0,_path.resolve)("..","build"))),app.get("*",(a,b)=>{b.sendFile((0,_path.resolve)("..","build","index.html"))});var _default=app;exports.default=_default;