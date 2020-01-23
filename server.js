'use strict';

const routes = require('./app/routes');
const PORT = process.env.PORT || 3000;

routes.listen(PORT, () => {
  console.log(`webhook is listening 🔥`);
});
