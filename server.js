'use strict';

const routes = require('./app/routes');
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


routes.listen(PORT, () => {
  console.log(`webhook is listening 🔥`);
});
