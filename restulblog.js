var mongoose=require("mongoose")
mongoose.connect("mongodb://localhost/blog_app")
var express=require("express");
var expressani=require("express-sanitizer");

var blog=express();
var bodyParser=require("body-parser");
blog.use(bodyParser.urlencoded({extended:true}));
blog.use(expressani());
var methodoverride=require("method-override");
blog.use(methodoverride("_method"));

var blogschema=new mongoose.Schema(
{
	title:String,
	image:String,
	des:String,
	created:{type:Date,default:Date.now}
});
var blogs=mongoose.model("blog",blogschema);



blog.get("/blogs/new",function(req,res)
{
	res.render("new.ejs");
});
blog.get("/",function(req,res)
{
	res.send("<h1><i>welcome to the home page!!! </i></h1>")

});

blog.post("/blogs",function(req,res)
{
	var title=req.body.title;
	var image=req.body.image;
	var des=req.body.des;
	req.body.des=req.sanitize(req.body.des);
	var allblogs={title:title,image:image,des:des};
	blogs.create(allblogs,function(err,newblog)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.redirect("/blogs");
		}
	});
});





blog.get("/blogs",function(req,res)
{
	blogs.find({},function(err,allblogs)
	{
		if(err)
		{ console.log(err);}
	else
		{res.render("index.ejs",{allblogs:allblogs});}
	});
	
});
blog.get("/blogs/:id",function(req,res)
{
	blogs.findById(req.params.id,function(err,allblogs)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("show.ejs",{blog:allblogs});
		}
	});
});
blog.get("/blogs/:id/edit",function(req,res)
{
	blogs.findById(req.params.id,function(err,allblogs)
	{
		if(err)
		{
			res.redirect("/blogs.ejs");
		}
		else
		{
			res.render("edit.ejs",{blog:allblogs});
		}
	});
});
blog.put("/blogs/:id",function(req,res)
{
	req.body.blog.des=req.sanitize(req.body.blog.des)
	blogs.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});
blog.delete("/blogs/:id",function(req,res)
	{
		blogs.findByIdAndRemove(req.params.id,function(err,relog)
		{
			if(err)
			{
				res.redirect("/blogs");
			}
			else
			{
				res.redirect("/blogs");
			}
		});
	});
blog.listen(3002,function()
{
	console.log("your server is running");
});