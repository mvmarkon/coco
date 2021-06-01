import { Schema, model } from 'mongoose';

const protocolSchemaDef = {
	active: {
		type: Boolean,
    default: true
	},
	name: {
		type: String,
		required: true
	},
  allowedHourFrom: {
    type: Number, // Se guardan en minutos de 0 a 1440
	},
	allowedHourTo: {
    type: Number, // Se guardan en minutos de 0 a 1440
  },
  allowedPlaces: [{
    type: Object,
	}],
	possibleCovidDays: {
		type: Number,
	},
	description: {
		type: String
	},
	quarantineCovid: {
		type: Number
	},
	quarantineContact: {
		type: Number
	}
};

const protocolSchema = new Schema(protocolSchemaDef);

export default model('Protocol', protocolSchema);
