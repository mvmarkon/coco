"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.port=exports.url=void 0;const url=process.env.MONGODB_URI||"mongodb+srv://coco_dev:coco_dev@cluster0.n28e2.mongodb.net/test?retryWrites=true&w=majority";exports.url=url;const port=process.env.PORT||9e3;exports.port=port;