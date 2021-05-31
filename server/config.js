export const url = process.env.MONGODB_URI || 'mongodb+srv://coco_dev:coco_dev@cluster0.n28e2.mongodb.net/test?retryWrites=true&w=majority';
export const port = process.env.PORT || 9000;
export const notificationTypes = [
    'Evento',
    'Contacto Estrecho',
    'Posible Positivo',
    'Resultado Test Positivo',
    'Resultado Test Negativo',
    'Evento Cancelado'
];
