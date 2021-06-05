export const url = process.env.MONGODB_URI || 'mongodb://coco_dev:coco_dev@cluster0-shard-00-00.n28e2.mongodb.net:27017,cluster0-shard-00-01.n28e2.mongodb.net:27017,cluster0-shard-00-02.n28e2.mongodb.net:27017/test?ssl=true&replicaSet=atlas-szr0x7-shard-0&authSource=admin&retryWrites=true&w=majority';
export const port = process.env.PORT || 9000;
export const notificationTypes = [
    'Evento',
    'Contacto Estrecho',
    'Posible Positivo',
    'Resultado Test Positivo',
    'Resultado Test Negativo',
    'Evento Cancelado'
];
export const healthCardTypes = ['Contacto Estrecho', 'Posible Positivo'];
export const cron_conf = '0 0 * * *'