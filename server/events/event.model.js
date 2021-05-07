import { Schema, model } from 'mongoose';
import { User } from '../users/user.model';
const eventSchemaDef = {
	eventName: {
    type: String,
    required: true,
	},
	date: {
		type: Date,
		required: true
	},
	duration: {
		type: Number
	},
	participants: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
  protocols: {
    type: String,
    required: true,
	},
	organizer: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true,
	}
};

const eventSchema = new Schema(eventSchemaDef);

export default model('Event', eventSchema);