import { Schema, model } from 'mongoose';

const userSchemaDef = {
  name: { type: String, required: true, },
  nickName:{ type: String, required: true, unique: true },
  password: { type: String },
  age: { type: Number, required: true, },
  email: { type: String, unique: true, required: true },
  known: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  healthy: { type: Boolean, default: true }
};

var userSchema = new Schema(userSchemaDef);

userSchema.methods.addKnownUser = async function (user) {
  this.acquaintances.push(user);
  await this.save();
}

userSchema.methods.removeKnownUser = async function (user) {
  this.acquaintances.pull(user);
  await this.save();
}

export default model('User', userSchema);
