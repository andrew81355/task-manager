import { Router } from "express";
const router = Router();

// Mock database
const resources = [
    { id: 1, name: 'Resource 1', description: 'This is resource 1', created_at: '2023-01-01T00:00:00Z' },
    { id: 2, name: 'Resource 2', description: 'This is resource 2', created_at: '2023-01-02T00:00:00Z' },
    // Add more mock resources as needed
  ];
  
  // Route to get resource by ID
  router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
  
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    const resource = resources.find(r => r.id === id);
  
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
  
    return res.status(200).json(resource);
  });


  export default router;