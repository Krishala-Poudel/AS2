const express = require('express');
const path = require('path');
const storeService = require('./store-service');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.static('views'));
// Routes
app.get('/', (req, res) => {
  res.redirect('/about');
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/shop', async (req, res) => {
  try {
    const items = await storeService.getPublishedItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching published items' });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await storeService.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching items' });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await storeService.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error fetching categories' });
  }
});

// 404 Route - Handles unmatched routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Initialize store service and start server
storeService.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log('✅ Server running on port ${PORT}');
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize store service: ${err}');
  });