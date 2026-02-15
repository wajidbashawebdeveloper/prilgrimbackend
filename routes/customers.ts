
import express from 'express';
import Customer from '../models/Customer';
import User from '../models/User';

const router = express.Router();

// Get all customers (All roles)
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Create Customer (Sub-Admin Only)
router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err });
  }
});

// Update Customer Status/Batch/Group (Employee/Sub-Admin)
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // If status changed to Booked, update employee target count
    if (req.body.status === 'Booked' && updated?.assignedEmployeeId) {
      await User.findByIdAndUpdate(updated.assignedEmployeeId, { $inc: { bookedCount: 1 } });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// Delete Customer (Sub-Admin Only)
router.delete('/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;
