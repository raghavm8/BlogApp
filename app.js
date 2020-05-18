var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var PORT = 4000
var methodOverride = require('method-override');
//var expressSanitizer = require('express-sanitizer');

// express configuration
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
//app.use(expressSanitizer);

// mongoose configuration
mongoose.connect("mongodb://localhost/blog",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : { type: Date, default: Date.now }
})
var Blog = mongoose.model('Blog',blogSchema);

// Routes

app.get('/',function(req,res){
    res.redirect('/blogs')
})

// NEW route
app.get('/blogs/new',function(req,res){
    res.render('new')
})

// CREATE route
app.post('/blogs',function(req,res){
    //req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newB){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/blogs')
        }
    })
})

// SHOW route
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect('/blogs')
            console.log(err);
        }
        else
        {
            res.render('show',{blog:foundBlog})
        }
    })
})

// EDIT route
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id, function(err,found){
        if(err){
            console.log(err)
            res.redirect('/blogs')
        }
        else{
            res.render('edit',{blog:found})
        }
    })
})

// UPDATE route
app.put('/blogs/:id',function(req,res){
    //res.send('update route');
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updated){
        if(err){
            console.log(err)
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs/'+req.params.id);
        }
    })
})

// DELETE route
app.delete('/blogs/:id',function(req,res){
    //res.send('this is the delete route')
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
            res.redirect('/blogs')
        }
        else{
            res.redirect('/blogs')
        }
    })
})

app.get('/blogs',function(req,res){
    Blog.find({},function(err,all){
        if(err){
            console.log(err)
        }
        else{
            res.render('index',{blogs:all});
        }
    })
})


app.listen(PORT, () => {
    console.log('server has started');
})