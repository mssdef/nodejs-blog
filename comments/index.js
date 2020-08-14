 const express = require('express');
 const bodyParser = require('body-parser');
 const { randomBytes } = require('crypto');
 const cors = require('cors');
 const axios = require('axios');

 const app = express();
 app.use(bodyParser.json());
 app.use(cors());

 const commentsByPostId = {};

 app.get('/posts/:id/comments', (req, res) => {
   // console.log('posts-comments-list');
   res.send(commentsByPostId[req.params.id] || []);
 });

 app.post('/posts/:id/comments', async(req, res) => {
   const id = randomBytes(4).toString('hex');

   const { content }  = req.body;
   console.log('posts-comments-create');

   const comments = commentsByPostId[req.params.id] || [];

   comments.push({id, content});
   commentsByPostId[req.params.id] = comments;

   // submit event
   await axios.post('http://localhost:4005/events', {
     type: 'CommentCreated',
     data: {
       id, content,
       postId: req.params.id
     }
   });

   res.status(201).send(comments);
 });

 app.post('/events', async(req, res) => {
   console.log('comments-received-event', req.body.type);
   res.send({});
 });


 app.listen(4001, () => {
   console.log('listen on 4001 port');
 });
