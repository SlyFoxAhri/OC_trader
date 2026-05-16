//import
const express = require('express');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

//create
const app = express();
app.use(express.json());

const users = [];

app.post('/registration',[
    body('email').isEmail().withMessage('Enter yo email'),
    body('password').isStrongPassword({minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}).isLength({min: 8, max:24}).withMessage('Password must be between 8 and 24 charachters and must contain uppercase, lowercase, number and a symbol')
    ],
    function(req, res){
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({errors: error.array()})
        }
        else{
            const {email, password} = req.body;
            const hashedPassword = bcrypt.hashSync(password, 4);
            users.push({email: email, password: hashedPassword});
            return res.status(200).json({message: 'Success :3'});
        }
    }

);

app.post('/login',[
    body('email').isEmail().withMessage('Enter yo email'),
    body('password').isString().withMessage('Enter yo password')
    ],
    function(req, res){
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({errors: error.array()});
        }
        else{
            const {email, password} = req.body;
            const user = users.find((u) => u.email == email);
            const isMatch = bcrypt.compareSync(password, user.password);

            if(!user)
                return res.status(400).json({error: 'Wrong email :/'});
            else{
                if(!isMatch) 
                return res.status(400).json({error: 'Wrong password :/'})
                else{return res.status(200).json({message: 'Logged in :3'});} //method t olog into ts
            }
            
        }
    }

);





//strat+confirm
const PORT = 4000;
app.listen(PORT, () => {
    console.log('The server is up :3');
});


