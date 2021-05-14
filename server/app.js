import express from 'express';
import { resolve } from 'path';
import itemsController from './items/items.controller';
import usersController from './users/users.controller';
import eventsController from './events/events.controller';
import protocolsController from './protocols/protocols.controller';
import notificationsController from './notifications/notifications.controller';

// Create the express application
const app = express();

// Assign controllers to routes
app.use('/api/items', itemsController);
app.use('/api/users', usersController);
app.use('/api/events', eventsController);
app.use('/api/protocols', protocolsController);
app.use('/api/notifications', notificationsController);

// Declare the path to frontend's static assets
app.use(express.static(resolve('..', 'build')));

// Intercept requests to return the frontend's static entry point
app.get('*', (_, response) => {
  response.sendFile(resolve('..', 'build', 'index.html'));
});

export default app;
