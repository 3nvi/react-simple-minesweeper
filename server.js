const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
// if not in production use the port 5000
const PORT = 8080;
console.log('server started on port:', PORT);
app.listen(PORT);
