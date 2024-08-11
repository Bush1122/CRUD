const express = require ('express');
const app = express();
const path = require('path'); 
const userModel = require('./models/user');
const user = require('./models/user');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))



app.get('/', async (req, res) => {
    try {
        let users = await userModel.find(); // Variable name updated to 'users' for clarity
        res.render('index', { users }); // Pass the users data to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/create', async (req, res) => {
    try {
        let { name, email, image } = req.body;

        let createuser = await userModel.create({ name, email, image });

       
        res.redirect('/');
        
    } catch (err) {
        res.status(500).send("Error creating user: " + err.message);
    }
  
});


app.get('/delete/:id', async (req , res) => {
    let user = await userModel.findOneAndDelete({_id:req.params.id });
    res.redirect('/');
})



app.get('/edit/:userid', async (req, res) => {
    try {
        let foundUser = await userModel.findOne({ _id: req.params.userid });
        if (!foundUser) {
            return res.status(404).send('User not found');
        }
        res.render('edit', { user: foundUser });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


app.post('/update/:userid', async (req, res) => {
    try {
        let { name, email, image } = req.body;
        await userModel.findOneAndUpdate(
            { _id: req.params.userid },
            { name, email, image },
            { new: true }
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating user: " + err.message);
    }
});




app.listen(3000 , function(){
    console.log("Typing here")

})