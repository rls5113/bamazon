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
        message: "Select a supervisor action.",
        choices:[
            "View product sales by department"
        ]
        }]).then(function (answer) {
            switch(answer.action) {
                case "View product sales by department":
                    displayItems();
                    break;
                default:
                    console.log("exit");
                    return;
            }

        });  

}


function displayItems() {

    var qstring = "select d.department_id, d.department_name, d.overhead_costs, sum(p.sales) sales , sum(p.sales) - d.overhead_costs profits from  departments as d left outer join products as p  on d.department_name=p.department_name group by d.department_name order by d.department_id";
  connection.query(qstring, function(err, res) {
    if (err) throw err;
    var table = new Table({
        head: ["ID", "Name", "Cost of goods","Total Sales","Profits"],
       colWidths: [6, 40, 15, 15, 15],
       colAligns:["right",null,"right","right","right"],
        chars: { "top": "═" , "top-mid": "╤" , "top-left": "╔" , "top-right": "╗"
               , "bottom": "═" , "bottom-mid": "╧" , "bottom-left": "╚" , "bottom-right": "╝"
               , "left": "║" , "left-mid": "╟" , "mid": "─" , "mid-mid": "┼"
               , "right": "║" , "right-mid": "╢" , "middle": "│" }

    });
    

    for(var i=0;i<res.length;i++){
        table.push(
            [res[i].department_id, res[i].department_name, res[i].overhead_costs.toFixed(2), res[i].sales.toFixed(2), res[i].profits.toFixed(2)]
        );
    }
    console.log(table.toString());
    connection.end();

    });
  
}


pickList();