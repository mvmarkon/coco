import { Schema, model } from 'mongoose';

const eventSchemaDef = {
	eventName: {
    type: String,
    required: true,
	},
	date: {
		type: Date,
		required: true
	},
	hourFrom: {
		type: Number, // Se guardan en minutos de 0 a 1440
		required: true
	},
	hourTo: {
		type: Number, // Se guardan en minutos de 0 a 1440
		required: true
  },
	participants: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	place: {
		type: Object,
		required: true
	},
	organizer: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true,
	},
	description: {
		type: String
	}
};

const eventSchema = new Schema(eventSchemaDef);

export default model('Event', eventSchema);