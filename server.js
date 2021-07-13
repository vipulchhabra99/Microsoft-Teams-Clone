const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const axios = require('axios')
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.use('/peerjs', peerServer);
app.use(express.static('public'));
require('./config/passport')(passport);

const db_connection = ''; // Enter Credentials here
mongoose.connect(db_connection, { useNewUrlParser: true ,useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected')).catch(err => console.log(err));
app.use(cors());

// Configuring required middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Initialized the passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Routes in API
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


// Handling socket connections
io.on('connection', socket => {
  socket.on('joinRoom', (roomId, userId) => {
    socket.join(roomId);
      
      socket.broadcast.to(roomId).emit('userConnected', userId);

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('userDisconnected', userId);
    });
    socket.on('sendMessage',msg=>{
      io.in(roomId).emit('recieve',msg);
    }); 
  });
  
});

// Port setting and running
var PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`Server started on port ${PORT}`));