const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/rapidred",{useNewUrlParser:true});


/*****************SCHEMAS********************/
const subscribeSchema={
  email: String
};

const bloodBankSchema={
  name: String,
  email: String,
  address: String,
  country: String,
  state: String,
  pincode: Number
};

const contactSchema={
  name: String,
  email: String,
  suggestions: String
};

const requestSchema={
  name: String,
  email: String,
  number: Number,
  bloodgroup: String,
  date:Date,
  createdAt: { type: Date, expires: '2880m', default: Date.now } //Expires each request after some time
};





/**************Collections****************/
const subscribe = mongoose.model("subscribe",subscribeSchema);
const contact = mongoose.model("contact",contactSchema);
const bloodBank = mongoose.model("bloodbank",bloodBankSchema);
const request = mongoose.model("request",requestSchema);




/*****************************GET REQUESTS****************************/
app.get("/",(req,res)=>{
	res.render("home");
});

app.get("/register",(req,res)=>{
	res.render("register",{
		stat: "none",
		id:0
	});
});

app.get("/banks",(req,res)=>{
	bloodBank.find({},(err,findItems)=>{
		if(!err){
			if(!findItems){
				console.log("Not found");
			}else{
				res.render("banks",{bloodBank:findItems});
			}
		}
	});
	
});

app.get("/about",(req,res)=>{
	res.render("about");
});

app.get("/request",(req,res)=>{
	res.render("request",{
		stat: "none"
	});
});

app.get("/:bankId", function(req,res){
	request.find({},(err,findItems)=>{
		if(!err){
			if(!findItems){
				console.log("Not found");
			}else{
				res.render("patient",{patients:findItems});
			}
		}
	});
});

/************************POST REQUESTS*******************/
app.post("/subscribe",(req,res)=>{

	const eid = new subscribe({
		email: req.body.email
	});
	eid.save();
	res.redirect("/");
});

app.post("/contact",(req,res)=>{
	const details = new contact({
		name: req.body.name,
  		email: req.body.email,
  		suggestions: req.body.suggestions
	});
	details.save();
	res.redirect("/about");
});

app.post("/register",(req,res)=>{
	const details=new bloodBank({
		name: req.body.orgName,
  		email: req.body.email,
  		address: req.body.address,
  		country: req.body.country,
  		state: req.body.state,
  		pincode:req.body.pincode
	});
	details.save();
	res.render("register",{
		stat: "block",
		id:details._id
	});
});

app.post("/request",(req,res)=>{
	const today=new Date();
	const details = new request({
		name: req.body.Name,
  		email: req.body.email,
  		number:req.body.number ,
  		bloodgroup: req.body.bloodgroup,
  		date:today
	});
	console.log(details);
	details.save();
	res.render("request",{
		stat: "block"
	});
});

app.post("/banklogin",(req,res)=>{
	const bankId=req.body.bankid;

	bloodBank.findOne({_id:bankId},function(err,found){
		if (!err) {
			if(!found){
				res.send("Not Found, Error. Please register first");
			}else{
				res.redirect("/id="+bankId);
			}
		}else{
			console.log(err);
			res.redirect("/");
		}
	});
});



/*******************************************************/
app.listen(3000, function() {
  console.log("Server started on port 3000");
});