"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _mongoose=require("mongoose"),_user=require("../users/user.model");const eventSchemaDef={eventName:{type:String,required:!0},date:{type:Date,required:!0},duration:{type:Number},participants:[{type:_mongoose.Schema.Types.ObjectId,ref:"User"}],protocol:{type:Object,required:!0},organizer:{type:_mongoose.Schema.Types.ObjectId,ref:"User",required:!0}},eventSchema=new _mongoose.Schema(eventSchemaDef);var _default=(0,_mongoose.model)("Event",eventSchema);exports.default=_default;