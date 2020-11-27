const router = require('express').Router();
const Post = require('../models/Post');


// Get back all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch(err) {
        res.status(400).send(err);
    }
});

// Get back a specific post
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch(err) {
        res.status(400).send(err);
    }
});

// Submit a post
router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const savedPost = await post.save()
        res.json(savedPost);
    } catch(err) {
        res.status(400).send(err);
    }
});

// Delete a post
router.delete('/:postId', async (req,res) => {
    try {
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost);
    } catch(err) {
        res.status(400).send(err);
    }
});

// Update a post
router.patch('/:postId', async (req, res) =>{
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId}, 
            {$set: {title: req.body.title, description: req.body.description}}
        );      
        res.json(updatedPost);      
    } catch(err) {
        res.status(400).send(err);
    }
});

module.exports = router;