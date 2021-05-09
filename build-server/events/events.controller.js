"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _bodyParser=_interopRequireDefault(require("body-parser")),_express=require("express"),_event=_interopRequireDefault(require("./event.model"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}const router=(0,_express.Router)();router.route("/").post(_bodyParser.default.json(),async(a,b)=>{try{const c=new _event.default(a.body),d=await c.save();return b.status(200).json(d)}catch(a){return b.status(400).send(a)}}),router.route("/organizer/:id").get(async(a,b)=>{try{const c=await _event.default.find({organizer:a.params.id});return b.status(200).json(c)}catch(a){return b.status(404).send(a)}}),router.route("/").get(async(a,b)=>{const c=await _event.default.find();return b.status(200).json(c)});var _default=router;exports.default=_default;