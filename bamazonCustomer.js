var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Roscoe5113!",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  displayItems();
});

function displayItems() {
  connection.query("SELECT item_id,product_name,price FROM products order by item_id", function(err, res) {
    if (err) throw err;
    var table = new Table({
        head: ["ID", "Item Description", "Price"],
       colWidths: [6, 40, 12],
       colAligns:["right",null,"right"],
        chars: { "top": "═" , "top-mid": "╤" , "top-left": "╔" , "top-right": "╗"
               , "bottom": "═" , "bottom-mid": "╧" , "bottom-left": "╚" , "bottom-right": "╝"
               , "left": "║" , "left-mid": "╟" , "mid": "─" , "mid-mid": "┼"
               , "right": "║" , "right-mid": "╢" , "middle": "│" }

    });
    

    for(var i=0;i<res.length;i++){
        table.push(
            [res[i].item_id, res[i].product_name, res[i].price.toFixed(2)]
        );
    }
    console.log(table.toString());
    // connection.end();

    //begin customer interaction
    inquirer.prompt([{
        name: "purchaseId",
        type: "input",
        message: "Please enter the ID of the item you wish to purchase.",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
            name: "purchaseQty",
            type: "input",
            message: "How many do you wish to purchase?"
        }]).then(function (answer) {
            // console.log(answer.purchaseId);
            // console.log(answer.purchaseQty);

            connection.query("select * from products where ?",
            {
              item_id: answer.purchaseId
            }, 
            function(err,res) {
              if(err)  throw err;
              // console.log(res[0]); 
              var item = res[0];             
              var transactionTotal = parseFloat(item.price) * parseFloat(answer.purchaseQty);
              
              if(item.stock_quantity - answer.purchaseQty < 0) {
                console.log("Insufficient quantity in stock. We only have "+item.stock_quantity+" of "+item.product_name+" available.");
                connection.end();
                return;
              }else {
                //update the current instock quantity
                connection.query("update products set ? where ?",
                [{
                  stock_quantity: parseInt(item.stock_quantity) - parseInt(answer.purchaseQty),
                  quantity_sold: parseInt(item.quantity_sold) + parseInt(answer.purchaseQty),
                  sales: transactionTotal + parseFloat(item.sales)
                },
                {
                  item_id: answer.purchaseId
                }], 
                function(err,res) {
                  if(err)  throw err;
                  console.log("Your purchase total is $"+transactionTotal.toFixed(2));
                  connection.end();
                });
              }
              
            });
        });  
    });
  
}

