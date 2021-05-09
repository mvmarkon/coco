import { Schema, model } from 'mongoose';

const protocolSchemaDef = {
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
    type: String,
	}],
	maxPeopleAllowed:{
		type: Number
	},
	description: {
		type: String
	}
};

const protocolSchema = new Schema(protocolSchemaDef);

export default model('Protocol', protocolSchema);
