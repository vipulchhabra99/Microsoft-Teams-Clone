const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');
const Chat = require('../models/Chat');
let user_data={}
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
  user_data=req.user;
  res.render('dashboard', {
    user: req.user
  })
}
);

// Route to create new room with random ID.
router.get('/create_room', (req,res)=>{res.redirect(`/chatroom/${uuidV4()}`);});

// Route to create chatrooms
router.get('/chatroom/:data', ensureAuthenticated, (req, res) => {
  res.render('chat_room', {roomId: req.params.data, user: user_data.name});
});

// Route to create video confrencing rooms
router.get('/room/:data',ensureAuthenticated, 
(req,res)=>{
res.render("room",{ roomId: req.params.data,user:user_data.name })});

// Route to store chat in the DB
router.post('/storeChat', ensureAuthenticated, (req, res) => {
  const {roomId, email, name, message} = req.body;
  const newChat = new Chat({roomId, email, name, message});
  newChat.save().catch(err => console.log(err));
});

// Route to fetch all chats in the DB
router.get('/fetchChat/:data', (req, res) => {
  Chat.find({roomId : req.params.data}, (err, chats) => {
    if(err){
      res.status(500).send(err);
      return;
    }
    res.send(chats);
    return;
  })
})


module.exports = router;
