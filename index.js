var express=require('express');
var bodyParser=require('body-parser');
var mysql= require('mysql2');
var bcrypt=require('bcrypt');
var jwt= require('jsonwebtoken');
const {checkJWT}=require('./functions');
const cookieParser = require('cookie-parser');
const path=require('path');
const cors=require('cors');

require('dotenv').config();


var app=express();

const port=process.env.PORT;
// connection configurations
var dbConn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DB_NAME
});

const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies)
  };

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(['/newgroup','/addmember','/deletegroup','/logout','/fetch','/edit'],checkJWT);
app.use(bodyParser.urlencoded({
    extended: true
}));

dbConn.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL:', error);
      return;
    }
  
    console.log('Connected to MySQL server.');
});


app.get('/fetch',function(req,res){
    let username=req.username;
    if(!username){
        return res.status(400).send({error:true,message:'Please provide correct username to fetch the information', status:400});
    }
    dbConn.query('SELECT gname FROM users where username=?', username, function (error, results, fields) {
        if (error)
            {
                return res.status(400).send({error: true, message:(error), status:400});
            }
        
        if(results.length == 0){
            console.log('No groups');
            return res.status(400).send({error:true,message:'No groups exist', status:400});
        }
        else{
        console.log(results);

        return res.status(200).send({ error: false, data: results, checker: username, message: 'Group list.', status:200 });
        }
    });
});



app.post('/login',async function(req,res){
    let username=req.body.username;
    let password=req.body.password;
    res.clearCookie("auth-token");
    if (!username || !password){
        return res.status(400).send({error:true,message:'No username/ password provided', status:400});
    }
    else{
        dbConn.query('SELECT password FROM users where username=?', username, async function (error, results, fields) {
            if (error)
            {
                return res.status(400).send({error: true, message:(error), status:400});
            }
            
            if(results.length == 0){
                console.log('User does not exist');
                return res.status(400).send({error:true,message:'User does not exist', status:400});
            }
            else{
            hashedPassword=results[0].password;
            const passwordMatch=await bcrypt.compare(password,hashedPassword);
                if(passwordMatch){
                    console.log('Login Successful');
                    const token=jwt.sign({_id:username}, process.env.TOKEN_SECRET);
                    console.log(`${username} is logged in`);
                    return res.cookie("auth-token",token,{httpOnly: true, path:'/'}).status(200).json({message:"Logged in", status:200});
                }
                else{
                    console.log('Password Incorrect');
                    return res.status(401).send({error:true, message:'Password Incorrect', status:401})
                }
            }
        });
        };
    });

app.post('/user',async function (req,res){
    let name=req.body.name;
    let username=req.body.username;
    let password=req.body.password;
    let mobile=req.body.mobile;
    let email=req.body.email;
    if(!name || !username || !password || !mobile || !email){
        return res.status(400).send({error:true,message:'Please provide all the information i.e. name, email, mobile', status:400});
    }
    const hashedPassword=await bcrypt.hash(req.body.password,10);
    dbConn.query("INSERT INTO USERS (NAME, USERNAME, PASSWORD, EMAIL, MOBILE, GNAME) VALUES (? , ? , ?, ?, ?, JSON_ARRAY())", [name, username, hashedPassword, email, mobile], function (error, results, fields){
        if (error)
            {
                return res.status(400).send({error: true, message:(error), status:400});
            }
        console.log('Success');
        return res.status(200).send({error: false, data: results, message: 'User has been added successfully.', status:200});
    } );
});

app.post('/edit',function(req,res){
    let username=req.username;
    let name=req.body.name;
    let mobile=req.body.mobile;
    let email=req.body.email;
    if (!username){
        return res.status(400).send({error:true,message:'No username/ password provided', status:400});
    }
        try{
            if(!name || !mobile || !email){
                console.log('Please provide all information');
                return res.status(400).send({error:true, message:'Insufficient data', status:400});
            }
            dbConn.query("UPDATE USERS SET name=?, email=?, mobile=? where username= ?", [name, email, mobile, username], function (error, results, fields){
                if (error)
                {
                    return res.status(400).send({error: true, message:(error), status:400});
                }
                console.log('Success');
                return res.status(200).send({error: false, data: results, message: ' user has been edited successfully.', status:200});
            } );
        }
        catch(error){
            res.status(400).send({error:true, message:'Login Expired', status:(400)})
        }
});

app.post('/newgroup', function(req,res){
    let username=req.username;
    let gname=req.body.gname;
    if (!username){
        return res.status(400).send({error:true,message:'Please login to continue', status:(400)});
    }
    if(!gname){
        return res.status(400).send({error:true,message:'Please provide group name', status:400});
    }
    dbConn.query(`CREATE TABLE ${gname} (username varchar(200) unique, access tinyint(1))`, function (error, results, fields){
        if (error)
        {
            return res.status(400).send({error: true, message:(error), status:400});
        }
        else{
        console.log('Success');}
    } );
    dbConn.query(`CREATE TABLE ${gname}message (username varchar(200), foreign key(username) references ${gname}(username), message text, sentat TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`, function (error, results, fields){
        if (error)
        {
            return res.status(400).send({error: true, message:(error), status:400});
        }
        else{
        console.log('Success Message table');
        return res.status(200);}
    } );
    dbConn.query(`INSERT INTO ${gname} (username, access) VALUES (?,0)`, [username], function (error, results, fields){
        if (error)
        {
            return res.status(400).send({error: true, message:(error), status:400});
        }
        else{
        console.log('Success Admin Set');
        return res.status(200);}
    } );
    dbConn.query(`UPDATE USERS SET GNAME=JSON_ARRAY_APPEND(GNAME,'$',?) where USERNAME = ?`,[gname, username], function(error,results,fields){
        if (error)
                {
                    return res.status(400).send({error: true, message:(error), status:400});
                }
        else{
                console.log('Success');
                return res.status(200).send({error: false, data: results[0], message: ' New Group Successfully Created', status:200});
        }
    });
});

app.post('/addmember',async function(req,res){
    let username=req.username;
    var approved1=false;
    var approved2=false;
    let member=req.body.member;
    let gname=req.body.gname;
    if (!username){
        return res.status(400).send({error:true,message:'Please login to continue', status:400});
    }
    if(!member){
        return res.status(400).send({error:true,message:'Please provide member name', status:400});
    }
        dbConn.query(`SELECT username FROM ${gname} where access=0`,function(error, results,fields){
            if (error)
            {
                return res.status(400).send({error: true, message:(error), status:400});
            }
            if(username===results[0].username){
                approved1=true;
            }
            else{
                approved1=false;
            }
        });
        dbConn.query(`SELECT username FROM users where username=?`,member,function(error, results, fields){
            if (error)
            {
                return res.status(400).send({error: true, message:(error), status:400});
            }
            if(results[0].username===member){
                approved2=true;
            }
            else{
                approved2=false;
            }
        checkApproval();
        });
    function checkApproval(){
    if(approved1==false || approved2==false){
        return res.status(400).send({error: true, message: 'You are not an admin or member does not exist', status:400});
    }
    else{
    dbConn.query(`INSERT INTO ${gname} (username, access) VALUES (?,1)`, [member, username], function (error, results, fields){
        if (error)
        {
            return res.status(400).send({error: true, message:(error), status:400});
        }
        console.log('Success Member Set');
        return res.status(200).send({error: false, data: results, message: 'Success Member Set', status:200});
    } );
    }
}
});

app.post('/deletegroup', async function(req,res){
    let username=req.username;
    let approved1=false;
    let gname=req.body.gname;
    if (!username){
        return res.status(400).send({error:true,message:'Please login to continue', status:400});
    }
    dbConn.query(`SELECT username FROM ${gname} where access=0`,function(error, results,fields){
        if (error)
        {
            return res.status(400).send({error: true, message:(error), status:400});
        }
        if(username===results[0].username){
            approved1=true;
        }
        else{
            approved1=false;
        }
        if(approved1==false){
            return res.status(400).send({error: true, message:'Either you are not the admin or the group does not exist', status:400});
        }
        else{
            dbConn.query(`DROP table ${gname}message`, function(error,results,fields){
                if (error)
                {
                    return res.status(400).send({error: true, message:(error), status:400});
                }
            })
            dbConn.query(`DROP table ${gname}`, function(error,results,fields){
                if (error)
                {
                    return res.status(400).send({error: true, message:(error), status:400});
                }
                else{
                    return res.status(200).send({error: false, message:'Group successfully deleted', status:200});
                }
            })
        }
    });
});

app.post('/logout',function(req,res){
    dbConn.end((error) => {
        if (error) {
          console.error('Already Logged Out, Login Again',error);
          return res.status(400).json({message:"Already Logged Out", status:400});
        }
    console.log('Successfully Logged Out');
    return res.clearCookie("auth-token").status(200).json({message:"Logged Out", status:200});
})
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
module.exports=app;
