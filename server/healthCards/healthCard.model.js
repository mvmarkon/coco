import { Schema, model } from 'mongoose';
import { healthCardTypes } from '../config';
/**
 * Información de cada formulario emitido de covid
Casos de aceptación:
* Tipo de Ficha (Contacto o Covid)
* Usuario Originario
* Fecha Inicio contacto o covid
* Cantidad dias transcurridos
* Usuarios afectados
*/
const healthCardSchemaDef = {
	type: { type: String, enum: healthCardTypes, required: true },
	sourceUser: { type: Schema.Types.ObjectId, ref: 'User' },
	startDate: { type: Date, required: true },
	affectedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
};

const healthCardSchema = new Schema(healthCardSchemaDef);

healthCardSchema.virtual('daysPassed').
	get(function () {
		var endDate = new Date(new Date().setHours(0, 0, 0, 0));
		var timeDiff = endDate - this.startDate;
		var daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));
		return daysDiff;
	})

export default model('HealthCard', healthCardSchema);