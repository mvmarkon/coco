import { Schema, model } from 'mongoose';

const eventSchemaDef = {
	eventName: { type: String, required: true },
	date: { type: Date, required: true },
	hourFrom: { type: Number, required: true },// Se guardan en minutos de 0 a 1440
	hourTo: {	type: Number, required: true },// Se guardan en minutos de 0 a 1440
	participants: [{ type: Schema.Types.ObjectId, ref: 'User'	}],
	place: { type: Object, required: true },
	organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	description: { type: String	}
};

var eventSchema = new Schema(eventSchemaDef);

eventSchema.methods.addParticipant = async function (user) {
  this.participants.push(user);
  await this.save();
};

eventSchema.methods.removeParticipant = async function (user) {
  this.participants.pull(user);
  await this.save();
};

export default model('Event', eventSchema);