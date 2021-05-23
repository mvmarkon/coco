import { Schema, model } from 'mongoose';

const userSchemaDef = {
  name: {
    type: String,
    required: true,
  },
  nickName:{
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  acquaintances: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  healthy: {
    type: Boolean,
    default: true
  }
};

const userSchema = new Schema(userSchemaDef);

export default model('User', userSchema);
