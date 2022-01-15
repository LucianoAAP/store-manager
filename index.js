require('dotenv').config();
const express = require('express');
const errorMiddleware = require('./middleware/error');

const app = express();
app.use(express.json());

app.use('/products', require('./routers/ProductsRouter'));

app.use('/sales', require('./routers/SalesRouter'));

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}`));
