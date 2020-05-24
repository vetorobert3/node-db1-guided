const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

// router.get('/', (req, res) => {
//   knex('post')
//     .then(posts => {
//       res.json(posts);
//     })
//     .catch(err => {
//       res.json(500).json({message: 'problem with db', error:err});
//     })
// });

router.get('/', async (req, res) => {
  try {
    const posts = await db('posts');
    res.json(posts);
  } catch (err) {
    res.status(500).json({message: 'problem with db', error:err});
  }  
})

router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const posts = await db('posts').where({id});
    res.json(posts)
  } catch (err) {
    res.status(500).json({message: 'ID not found', error:err});
  }
});

router.post('/', async (req, res) => {
  const postData = req.body;
  try {
    const numPosts = await db('posts').insert(postData);
    res.status(201).json(numPosts)
  } catch (err) {
    res.status(500).json({message: 'problem with db', error:err});
  }
});

router.put('/:id', async (req, res) => {
  const {id} = req.params;
  const newPost = req.body;
  try {
    const count = await db('posts').update(newPost).where({id})
    if (count) {
      res.json({updated: count});
    } else {
      res.status(404).json({messge: 'invalid id'});
    }
  } catch (err) {
    res.status(500).json({message: 'problem with db', error:err});
  }
});

router.delete('/:id', async(req, res) => {
  const {id} = req.params;
  try {
    const count = await db('posts').del().where({id});
    if (count) {
      res.json({deleted: count});
    } else {
      res.status(404).json({messge: 'invalid id'});
    }
  } catch (err) {
    res.status(500).json({message: 'problem with db', error:err});
  }
});

module.exports = router;