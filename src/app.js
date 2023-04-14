const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 2000;
const Register = require("./models/registers")
const Request = require("./models/requests")
const Contact = require("./models/contact")
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const session = require('express-session');
let activeReq = require("./models/requests")
const window = require('window')

require("./db/conn");

const static_path = path.join(__dirname,'public')
const templates_path = path.join(__dirname,"../templates/views")
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static(static_path));
// app.set("view engine", "hbs");
app.set('view engine', 'ejs');
app.set("views",templates_path);

app.get("/", (req,res)=> {
    res.render("login")
});
app.get("/signup", (req,res)=> {
    res.render("signup")
});
app.get("/login", (req,res)=> {
    res.render("login")
});
app.post("/signup", async (req,res)=> {
    try{
        const Password = req.body.Password;
        const Confirmpassword = req.body.Confirmpassword;
        
        if(Password == Confirmpassword){

            const registerEmployee = new Register({
                Name: req.body.Name,
                Age: req.body.Age,
                EmailAddress: req.body.EmailAddress,
                Password: Password,
                Confirmpassword: Confirmpassword,
                Contact: req.body.Contact
            })
            
            const registered = await registerEmployee.save();
            res.status(201).render('login');
        }

        else{
            res.send(`passwords are not matching`)
        }
    }
    catch(err){
        res.status(400).send(err);
    }
});

app.get("/dashboard",(req,res) => {
    res.render("dashboard")
})

// // replace with your email and password
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'swapnildubey3636@gmail.com',
        pass: 'swapnildubey',
    },
   });
    
    // replace with your database implementation to check user email
const users = [
    { id: 1, email: 'user1@example.com', password: 'password1' },
    { id: 2, email: 'user2@example.com', password: 'password2' },
    { id: 3, email: 'user3@example.com', password: 'password3' },
  ];

  app.post('/Forgot password?', (req,res) => {
    const{email} = req.body;
    const user = user.find((user) => user.email === email);

    if(!user){
       return res.status(404).json({message: 'User not found'});
    }
    const token = crypto.randomBytes(20).toString('hex');
    
    user.restPasswordToken = Token;
    user.restPasswordExpires = Data.now() + 3600000; // 1hour
   
    const mailOptions = {
        form: 'swapnildubey3636@gmail.com',
        to: email,
        subject: 'Reset Password',
        html:  `
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>http://${req.headers.host}/reset-password/${token}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    transporter.sendMail(mailOptions,(error,info) =>{
        if(error) {
            console.log(error);
            return res.status(500).json({message: 'internal server error'});
       }
       console.log(`Email sent: ${info.response}`);
       res.status(200).json({message: `Email sent`});
    });
});
// reset password
app.get('/reset-password/:token',(req,res) => {
    const{ token } = req.params;
    const user = users.find((user) => user.resetPasswordToken === token && user.resetPasswordExpires > Date.now());
    
      if(!user){
        return res.status(404).json({message: 'invalid or expired token'});
      }
      res.send(`
      <form method="POST" action="/reset-password">
        <input type="hidden" name="token" value="${token}">
        <label for="password">New Password:</label>
        <input type="password" name="password" required>
        <button type="submit">Reset Password</button>
      </form>
    `);
});
// reset password point
app.post('/reset-password',(req,res) => {
    const {token , password} = req.body;
    const user = user.find((user) => user.resetPasswordToken === token && user.resetPasswordExpires > Date.now());
    
    if(!user){
        return res.status(404).json({message: 'Invalid or expired token'});
    }
  user.password
});
  
// LOGIN

app.post("/login", async (req,res)=> {
    try{
        const EmailAddress = req.body.EmailAddress;
        const Password = req.body.Password;    
        const useremail = await Register.findOne({EmailAddress : EmailAddress});
        const PasswordMatch = await bcrypt.compare(Password , useremail.Password)
        if(PasswordMatch){
            res.status(200).render("dashboard");
            // res.send(useremail);
            // console.log(useremail);
        }
        else{
            res.status(400).send(`invalid password`)
        }
    }
    catch(error){
        res.status(400).send("Invalid Credantials")
    }
});

app.get("/CreateRequest" , (req,res) => {
    res.render("CreateRequest")
})

app.post("/CreateRequest", async (req,res)=> {
    try{
            const registerRequest = new Request({
                FName: req.body.FName,
                EmailAddress: req.body.EmailAddress,
                Amount: req.body.Amount,
                Contact: req.body.Contact,
                Purpose : req.body.Purpose,
                InterestRate:req.body.InterestRate
            })
            const requested = await registerRequest.save();
            res.status(201).render('ActiveRequests');
        }
    catch(err){
        res.status(400).send(err);
    }
});
  

 app.get('/ActiveRequests',(req, res)=>{
    activeReq.find({})
    .then((x)=>{
        res.render('ActiveRequests', {x})
        console.log(x);
    }).catch((y) =>{
        console.log(y);
    })
    
})
app.get("/CounterRequest" , (req,res) => {
    res.render("CounterRequest")
})

app.post("/CounterRequest", async (req,res)=> {
    try{
                const CounterRequest = new CounterRequest({
                BName: req.body.BName,
                LName:req.body.LName,
                EmailAddress: req.body.EmailAddress,
                Amount: req.body.Amount,
                Contact: req.body.Contact,
                InterestRate:req.body.InterestRate
            })
            const countered = await CounterRequest.save();
            res.status(201).render('ActiveRequests');
        }catch(err){
        res.status(400).send(err);
    }
});
app.get('/RequestStatus',(req, res)=>{
    activeReq.find({})
    .then((x)=>{
        res.render('RequestStatus', {x})
        console.log(x);
    }).catch((y) =>{
        console.log(y);
    })
    
})

//---------------------------------------------------------------------------------------------

// app.get("/RequestStatus" , (req,res) => {
   
//        //Accept request endpoint
// app.post('/ActiveRequests/:EmailAddress',requestSchema)

// //Function to accept Active request
//  async function acceptActiveRequest(req,res){
//      const { requested } =  req.params;
//      const currentUser = req.Request; //Assuming authentication middleware sets the user object in request object
    
//      try{
//         await usersRequest.updateone(
//             {from: EmailAddress, to: EmailAddress, status:'Pending'},
//             {status: 'Accepted'}
//         );
//                 //Add each other as users
//                 await Promise.all([
//                     Request.updateOne(
//                         { _id: currentUser.EmailAddress },
//                         { $addToSet: { Requests: EmailAddress } }
//                     ),
//                     Request.updateOne(
//                         { _id: currentUser.EmailAddress },
//                         { $addToSet: { Requests: EmailAddress } }
//                     ),
//                 ]);
                
//                 res.status(200).send('users request accepted successfully.');
//             } catch (error) {
//                 console.log(error);
//                 res.status(500).send('Something went wrong while accepting users request.');
//             }
//         }

// //Display users endpoint
// app.get('RequestStatus', acceptActiveRequest)
// //Function to get users list
// async function getusersList(req, res) {
//     const currentUser = req.user; //Assuming authentication middleware sets the user object in request object
    
//     try {
//         //Fetch the current user's  list
//         const usersList = await User.findById(currentUser._id, 'users').populate('users', 'name');
        
//         res.status(200).send(usersList.users);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Something went wrong while fetching users list.');
//     }
// }        



// });

app.get('/ActiveRequest/accept', async (req,res)=>{
    try{
        const SenderId = req.body.SenderId;
        const RecieverId = req.body.RecieverId;

        const registerStatus = new Status({
            SenderId:SenderId,
            RecieverId :RecieverId 
        })
        const stated = await registerStatus.save();
        // res.status(201).render('RequestStatus');
        
    }catch(err){
        res.status(400).send(err);
    }
    res.render('/api/ActiveRequest/accept');
})


app.post('/ActiveRequest/accept', async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
  
      // Update the friend request status in the database
      const friendRequest = await Status.findOneAndUpdate(
        { senderId, receiverId, status: 'pending' },
        { status: 'accepted', acceptedAt: new Date() },
        { new: true }
      );
  
      // If the friend request was not found or already accepted, return an error response
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found or already accepted' });
      }
  
      // Update the user's friend lists in the database
      await Register.findOneAndUpdate(
        { _id: senderId },
        { $addToSet: { deals: receiverId } }
      );
  
      await Register.findOneAndUpdate(
        { _id: receiverId },
        { $addToSet: { deals: senderId } }
      );
  
      // Return a success response with the updated friend request object
      console.log(friendRequest);
      return res.status(200).json(friendRequest);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


//-------------------------------------------------------------------------------------------------------------

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true
  }));
app.get('/logout', (req, res) => {
    // Clear session data
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      } else {
        // Redirect to login page
        res.redirect('/login');
      }
    });
    // window.history.pushState(null, null, window.location.href);
    // window.onpopstate = function() {
    // window.history.go(1);
// };
  });

  app.get("/profile" , (req,res)=>{
    res.render("profile")
  })
  app.get("/contact" , (req,res)=>{
    res.render("Contact")
  })

  app.post("/Contact", async (req,res)=> {
    try{
            const registerContact = new Contact({
                FName: req.body.FName,
                EmailAddress: req.body.EmailAddress,
                Contact: req.body.Contact,
                Subject: req.body.Subject,
                Query:req.body.Query
            })
            const contacted = await registerContact.save();
            res.status(201).render('Contact');
        }
    catch(err){
        res.status(400).send(err);
    }
});
  app.get('/profile/:id', async (req, res) => {
    try {
      // Connect to the MongoDB server
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const db = client.db('Registration');
      const users = db.collection('registers');
  
      // Find the user with the specified ID
      const user = await users.findOne({ _id: new ObjectId(req.params.id) });
  
      // Render the profile page with the user data
      res.render('profile', { user });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  });



app.listen(port , ()=>{
    console.log(`server is running at port no. ${port}`);
});