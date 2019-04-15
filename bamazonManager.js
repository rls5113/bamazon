var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var Product = function(product_name,price,stock_quantity,department_name){
    this.product_name = product_name,
    this.price = price,
    this.stock_quantity = stock_quantity,
    this.department_name = department_name
}

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Roscoe5113!",
  database: "bamazon_db"
//  ,debug:true
});

connection.connect(function(err) {
  if (err) throw err;
//  console.log("connected as id " + connection.threadId);
//   displayItems();
});

function pickList() {
    //begin manager interaction
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Select a manager action.",
        choices:[
            "View products for sale",
            "View low inventory (quantity less than 5)",
            "Add item to inventory",
            "Add new product",
            "Exit"
        ]
        }]).then(function (answer) {
            switch(answer.action) {
                case "View products for sale":
                    // console.log("View products");
                    displayItems();
                    break;
                case "View low inventory (quantity less than 5)":
                    // console.log("View low");
                    displayLowInventory();
                    break;
                case "Add item to inventory":
                    // console.log("Add item");
                    addToInventory();
                    break;
                case "Add new product":
                    console.log("Add product");
                    addNewProduct();
                    break;
                default:
                    console.log("exit");
                    break;
            }

        });  

}

function addToInventory() {
    inquirer.prompt([{
        name: "itemid",
        type: "input",
        message: "Please enter the ID of the item you wish to add inventory.",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
            name: "qty",
            type: "input",
            message: "How many items do you wish to add to inventory?"
        }]).then(function (answer) {
            // console.log(answer.itemid);
            // console.log(answer.qty);

            connection.query("update products set ? where ?",
            [{
                stock_quantity: answer.qty
            },
            {
                item_id: answer.itemid
            }
            ], 
            function(err,res) {
              if(err)  throw err;
              console.log("Inserted "+res.affectedRows+" record(s)");
              inquirer.prompt({
                  name: "act",
                  type: "list",
                  message: "Add inventory to another product?",
                  choices: ["Yes","No"]
              }).then( function (answr) {
                  if(answr.act === "Yes") {
                      addToInventory();
                  }else{
                      connection.end();
                      return;
                  }
              }); 
  
                
              
            });
        });  
        
}

function addNewProduct() {
    inquirer.prompt([{
            name: "name",
            type: "input",
            message: "Please enter name of this product.",
        },
        {
            name: "price",
            type: "input",
            message: "What is the price?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name: "qty",
            type: "input",
            message: "What is the beginning quantity in stock?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name: "dept",
            type: "list",
            message: "Select department",
            choices:[
                "Shoes",
                "Apparel",
                "Accessories",
                "Electronics",
                "Housewares"
            ]
        }
    ]).then(function (answer) {

        // var item = new Product(answer.name,parseFloat(answer.price),parseInt(answer.qty),answer.dept);
        // console.log(item);
        // product_name,price,stock_quantity,department_name
        connection.query("insert into products set ?",
        {
            product_name: answer.name.trim(),
            price: answer.price,
            stock_quantity: answer.qty,
            department_name: answer.dept
        }, 
        function(err,res) {
            if(err)  throw err;
            console.log("Inserted "+res.affectedRows+" record(s)");
            inquirer.prompt({
                name: "act",
                type: "list",
                message: "Enter another product?",
                choices: ["Yes","No"]
            }).then( function (answr) {
                if(answr.act === "Yes") {
                    addNewProduct();
                }else{
                    connection.end();
                    return;
                }
            }); 

        });
    });  

}


function displayItems() {
  connection.query("SELECT item_id,product_name,price,stock_quantity FROM products order by item_id", function(err, res) {
    if (err) throw err;
    var table = new Table({
        head: ["ID", "Item Description", "Price","Qty in stock"],
       colWidths: [6, 40, 12, 15],
       colAligns:["right",null,"right","right"],
        chars: { "top": "═" , "top-mid": "╤" , "top-left": "╔" , "top-right": "╗"
               , "bottom": "═" , "bottom-mid": "╧" , "bottom-left": "╚" , "bottom-right": "╝"
               , "left": "║" , "left-mid": "╟" , "mid": "─" , "mid-mid": "┼"
               , "right": "║" , "right-mid": "╢" , "middle": "│" }

    });
    

    for(var i=0;i<res.length;i++){
        table.push(
            [res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]
        );
    }
    console.log(table.toString());
    connection.end();

    });
  
}

function displayLowInventory() {
  connection.query("SELECT item_id,product_name,price,stock_quantity FROM products where stock_quantity < 5 order by item_id", function(err, res) {
    if (err) throw err;
    var table = new Table({
        head: ["ID", "Item Description", "Price","Qty in stock"],
       colWidths: [6, 40, 12, 15],
       colAligns:["right",null,"right","right"],
        chars: { "top": "═" , "top-mid": "╤" , "top-left": "╔" , "top-right": "╗"
               , "bottom": "═" , "bottom-mid": "╧" , "bottom-left": "╚" , "bottom-right": "╝"
               , "left": "║" , "left-mid": "╟" , "mid": "─" , "mid-mid": "┼"
               , "right": "║" , "right-mid": "╢" , "middle": "│" }

    });
    
    if(res.length < 1){
        console.log("No low items in stock");
    }
    else {
        for(var i=0;i<res.length;i++){
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity]
            );
        }
        console.log(table.toString());
    }
    connection.end();

    });
  
}

pickList();