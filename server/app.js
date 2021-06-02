import express from 'express';
import { resolve } from 'path';
import itemsController from './items/items.controller';
import usersController from './users/users.controller';
import eventsController from './events/events.controller';
import protocolsController from './protocols/protocols.controller';
import notificationsController from './notifications/notifications.controller';
import healthCardsController from './healthCards/healthCards.controller';
import { followUpProcess } from './helpers/followUpHelper';

// Create the express application
const app = express();
followUpProcess();
// Assign controllers to routes
app.use('/api/items', itemsController);
app.use('/api/users', usersController);
app.use('/api/events', eventsController);
app.use('/api/protocols', protocolsController);
app.use('/api/notifications', notificationsController);
app.use('/api/healthcards', healthCardsController);

// Declare the path to frontend's static assets
app.use(express.static(resolve('..', 'build')));

// Intercept requests to return the frontend's static entry point
app.get('*', (_, response) => {
  response.sendFile(resolve('..', 'build', 'index.html'));
});

export default app;
