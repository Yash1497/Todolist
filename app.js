var express = require("express"),
app     = express(),

///////////////////////////DATABSE ////////////////////////////////

mongoose = require("mongoose"),

//////////////////////////TAKE REQUEST FROM FORM//////////////////////

bodyParser = require("body-parser"),


expressSanitizer = require("express-sanitizer"),

//////////////////////////METHOD TO EDIT OR DELETE/////////////////////

methodOverride = require('method-override');

////////////////////////////////CONNECT TO DATA BASE//////////////////////

mongoose.connect("mongodb://localhost/todo_app_1");

/////////////////////////////////////ATTACH PUBLIC FOLDER/////////////////////////

app.use(express.static('public'));

//////////////////////////////////////USE BODYPARSER AFTER CONNECT///////////////////////

app.use(bodyParser.urlencoded({extended: true}));

app.use(expressSanitizer());

///////////////////////////////////////SET EJS INSTEAD OF HTML FOR FRONTEND////////////////////////////

app.set("view engine", "ejs");

///////////////////////////////////////USE METHODOVERRIDE//////////////////////////////////////////

app.use(methodOverride('_method'));


///////////////////////////////////////MAIN MODEL //////////////////////////////////

var todoSchema = new mongoose.Schema({
  text: String,
});

var Todo = mongoose.model("Todo", todoSchema);

//CRUD app
// C = CREATE(POST)
// R = READ(GET)
// U = UPDATE(PUT)
// D = DELETE(DELETE)


////////////////GET REQUEST TO MAIN PAGE///////////////////////////////////////

app.get("/", function(req, res){

  Todo.find({}, function(err, todos){
    if(err){
      console.log(err);
    } else {
      res.render("index", {todos: todos}); 
    }
  })
});


/////////////////////////GET REQUEST TO CREATE NEW TODO PAGE ///////////////////////////////


app.get("/todos/new", function(req, res){
 res.render("new"); 
});


//////////////////////////POST REQUEST OR CREATE NEW TODO /////////////////////////////////////


app.post("/todos", function(req, res){
 req.body.todo.text = req.sanitize(req.body.todo.text);
 var formData = req.body.todo;
 Todo.create(formData, function(err, newTodo){
    if(err){
      res.render("new");
    } else {
        res.redirect("/");
    }
  });
});

//////////////////////////UPDATE REQUEST OR EDIT  TODO  PAGE /////////////////////////////////////


app.get("/todos/:id/edit", function(req, res){
 Todo.findById(req.params.id, function(err, todo){
   if(err){
     console.log(err);
     res.redirect("/")
   } else {
      res.render("edit", {todo: todo});
   }
 });
});

//////////////////////////UPDATE(PUT) REQUEST OR EDIT  TODO /////////////////////////////////////


app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.redirect('/');
   }
 });
});

//////////////////////////DELETE REQUEST OR TODO /////////////////////////////////////


app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
//      todo.remove();
      res.redirect("/");
   }
 }); 
});


app.listen(3000, function() {
  console.log('Server running on port 3000');
});

// // Uncomment the three lines of code below and comment out or remove lines 84 - 86 if using cloud9
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("The server has started!");
// });
