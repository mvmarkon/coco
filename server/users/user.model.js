import { Schema, model } from 'mongoose';

const userSchemaDef = {
  name: { type: String, required: true },
  nickName:{ type: String, required: true, unique: true },
  age: { type: Number },
  email: { type: String, unique: true, required: true },
  acquaintances: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
