const app = require('./app');

// Configuration
const PORT = 3002;

app.listen(PORT, () => {
    console.log(`APP listening to port number ${PORT}`);
});
