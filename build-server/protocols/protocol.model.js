"use strict";var _mongoose=require("mongoose");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;const protocolSchemaDef={name:{type:String,required:!0},allowedHourFrom:{type:Number// Se guardan en minutos de 0 a 1440
},allowedHourTo:{type:Number// Se guardan en minutos de 0 a 1440
},allowedPlaces:[{type:String}],maxPeopleAllowed:{type:Number},description:{type:String}},protocolSchema=new _mongoose.Schema(protocolSchemaDef);var _default=(0,_mongoose.model)("Protocol",protocolSchema);exports.default=_default;