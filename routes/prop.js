const express = require('express');
const Prop = require('../models/Prop');

const router = express.Router();

router.post('/add', async (req, res) => {
  const {
    name,
    type,
    propertyType,
    price
  }= req.body;

  if(!name||!type|| !propertyType||!price) return res.status(500).json({ error: 'Missing fields' }); 

  try {
    const prop = new Prop({...req.body,price:Number(price)});
    await prop.save();

    return res.status(200).json({ 
      message: 'Login successful'
    });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/edit/:id', async (req, res) => {
  const {
    name,
    type,
    propertyType,
    price
  }= req.body;
  
  if(!name || !type || !propertyType || !price) return res.status(500).json({ error: 'Missing fields' });

  try {
    await Prop.updateOne({_id: req.params.id},{$set:req.body});
    return res.status(200).json({ 
      message: 'Successfully updated'
    });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  if(!req.params.id) return res.status(500).json({ error: 'Missing fields' });
  try {
      await Prop.deleteOne({_id: req.params.id});
      return res.status(200).json({ 
        message: 'Successfully deleted'
      });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/count', async (req, res) => {
  if(req.query.minPrice || req.query.maxPrice) {
    req.query.price={
      ...req.query.minPrice?{$gte: Number(req.query.minPrice)}:{},
      ...req.query.maxPrice?{$lte: Number(req.query.maxPrice)}:{},
    }
    delete req.query.minPrice
    delete req.query.maxPrice
  }
  Object.keys(req.query).forEach(key => {
    if(['','undefined'].includes(req.query[key])) delete req.query[key]
  });

  try {
      const count = await Prop.countDocuments({...req.query});
      return res.status(200).json({ 
        count:count
      });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/list', async (req, res) => {
  if(req.query.minPrice || req.query.maxPrice) {
    req.query.price={
      ...req.query.minPrice?{$gte: Number(req.query.minPrice)}:{},
      ...req.query.maxPrice?{$lte: Number(req.query.maxPrice)}:{},
    }
    delete req.query.minPrice
    delete req.query.maxPrice
  }
  Object.keys(req.query).forEach(key => {
    if(['','undefined'].includes(req.query[key])) delete req.query[key]
  });
  try {
      const prop = await Prop.find({...req.query});
      return res.status(200).json({ 
        properties: prop
      });
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
