import express from 'express';
import bodyParser from 'body-parser';

import split_paymentsRoutes from './routes/split_payments.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use('/split-payments', split_paymentsRoutes);

app.get('/', (req, res) => {
    res.send('Hello from HomePage.')});

app.listen(PORT, ( ) =>console.log(`Server running on port: http://localhost:${PORT}`) );
