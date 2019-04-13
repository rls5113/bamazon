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
  console.log("connected as id " + connection.threadId);
  displayItems();
  connection.end();
});

function displayItems() {
  connection.query("SELECT item_id,product_name,price FROM products order by product_name", function(err, res) {
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
            console.log(answer.purchaseId);
            console.log(answer.purchaseQty);

            connection.query("select stock_quantity from products where item_id = ?",
            {
              item_id: answer.purchaseId
            }, 
            function(err,res) {
              if(err)  throw err;
              console.log(query.sql);
              console.log(res.stock_quantity);
              
                // console.log("id: "+answer.purchaseId+" qty is "+res);


            });

            // switch (answer.purchaseId) {
            //     case "purchaseQty":
            //         console.log("qty");
            //         break;
            //     case "default":
            //         console.log("id");
            //         break;
            // }
        });  
    });
  
}

function getQtyForUnit(id) {
  connection.query("select stock_quantity from product where item_id = ?",
  {
    item_id: id
  }, 
  function(err,res) {
    if(err)  throw err;
    console.log(res);
      console.log("id: "+id+" qty is "+res);
      return res;
  });
}
