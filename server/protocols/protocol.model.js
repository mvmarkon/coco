import { Schema, model } from 'mongoose';

const protocolSchemaDef = {
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
	}
};

const protocolSchema = new Schema(protocolSchemaDef);

export default model('Protocol', protocolSchema);
