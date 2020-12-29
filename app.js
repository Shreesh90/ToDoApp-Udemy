
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + "/date.js");
const lo = require("lodash");

app.set('view engine' ,'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin-shreesh:shreeDB01@cluster0.nbesa.mongodb.net/todolistDB", {useNewUrlParser: true,  useUnifiedTopology: true});

const itemSchema = {
    name: String
};

const Item =  mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Dancing"
});

const item2 = new Item({
    name: "Writing"
});

const item3 = new Item({
    name: "Dreaming"
});

defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

// var items = ["Dancing", "Writing", "Dreaming"];
// var workItems = []

app.get("/", function(req, res) {

    // let day = date.getDay();

    Item.find({}, function(err, found) {
        if(found.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Documents Inserted uccessfully!");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: found});
        }
        // console.log(found);
    });
});

app.post("/", function(req, res) {
    // console.log(req.body);
    const toAdd = req.body.ToDo;
    const listName = req.body.list;

    const newItemDoc = new Item({
        name: toAdd
    });

    if(listName === "Today"){
        newItemDoc.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, result) {
                result.items.push(newItemDoc);
                result.save();
                res.redirect("/" + listName);
        });
    }

    // newItemDoc.save();
    // res.redirect("/");

    // if(req.body.list == "Work"){
    //     workItems.push(toAdd); 
    //     res.redirect("/work");
    // } else {
    //     items.push(toAdd);
    //     res.redirect("/");
    // }
})

app.post("/delete", function(req, res) {
    // console.log(req.body);
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemID, function(err) {
            if(err){
                console.log(err);
            } else {
                console.log("Successfully removed the checked item!");
            }
            res.redirect("/");
        });
    } else {
         List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, result){
             if(!err){
                 res.redirect("/" + listName);
             }
         })
    }
    
});

app.get("/:routeName", function(req, res) {
    const customList = lo.capitalize(req.params.routeName);

    List.findOne({name: customList}, function(err, result) {
        if(!err){
            if(!result){
                // console.log("Doesn't Exist");
                // Create the List
                const list = new List({
                    name: customList,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customList);
            } else {
                // console.log("Exists");
                // Populate the existing List
                res.render("list", {listTitle: result.name, newListItems: result.items})
            }
        }
    });

});

// app.get("/work", function(req, res) {
//     res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.post("/work", function(req, res) {
//     var toAdd = req.body.ToDo;
//     workItems.push(toAdd);
//     res.redirect("work");
// })

// app.get("/about", function(req, res) {
//     res.render("about");
// });


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
app.listen(port, function() {
    console.log("Server has started successfully.");
});

