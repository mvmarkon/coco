import { Schema, model } from 'mongoose';

const notificationSchemaDef = {
	notificationName: {
    type: String,
    required: true,
	},
	date: {
		type: Date,
		required: true
	},
	notifier: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	notify_to: [{
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	}],
	event: {
		type: Schema.Types.ObjectId, ref: 'Event'
	},
	description: {
		type: String
	},
	notified: {
		type: Boolean,
		required: true,
		default: false
	}
};

const notificationSchema = new Schema(notificationSchemaDef);

export default model('Notification', notificationSchema);