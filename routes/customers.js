
const express = require('express');
const Customer = require('../models/Customer');
const User = require('../models/User');

const router = express.Router();

// READ ALL
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    
    // If initially created as Booked, update employee stats
    if (newCustomer.status === 'Booked' && newCustomer.assignedEmployeeId) {
      await User.findByIdAndUpdate(newCustomer.assignedEmployeeId, { $inc: { bookedCount: 1 } });
    }
    
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: 'Error creating customer', error: err.message });
  }
});

// UPDATE
router.patch('/:id', async (req, res) => {
  try {
    const original = await Customer.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Customer not found' });

    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Auto-update employee stats if status changed to Booked
    if (req.body.status === 'Booked' && original.status !== 'Booked' && updated.assignedEmployeeId) {
      await User.findByIdAndUpdate(updated.assignedEmployeeId, { $inc: { bookedCount: 1 } });
    } else if (req.body.status !== 'Booked' && original.status === 'Booked' && updated.assignedEmployeeId) {
      // If changed away from Booked, decrement
      await User.findByIdAndUpdate(updated.assignedEmployeeId, { $inc: { bookedCount: -1 } });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer && customer.status === 'Booked' && customer.assignedEmployeeId) {
      await User.findByIdAndUpdate(customer.assignedEmployeeId, { $inc: { bookedCount: -1 } });
    }
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
