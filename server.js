
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.use('/styles', express.static(path.join(__dirname, 'styles')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

// (Opcional) Otras rutas de páginas estáticas
// app.get('/index.html', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
// });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
