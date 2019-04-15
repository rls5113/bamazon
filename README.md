# bamazon
This project, bamazon, is a class project in node.js command line interface programming.  Inquirer library is used extensibly to take in user feedback for three modules, and provides the information requested.  
Customer interface - allows a user to purchase the desired quantity of items from a list.  If the quantity is not available, the user is told how many are currently in stock, and allows user to purchase up to that number.  The totals are saved.

Manager interface - provides the user with four different operational activities:
 * show the list - shows the list of goods in the store
 * low inventory list - shows items having less than 5 in stock.
 * add to inventory - allows a manager to increase in stock item quantities
 * add to product - allows a manager to add new items into the store

Supervisor interface - prints a list of departments and calculates profit for each