// Require dependencies
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employees_db'
});

function initPrompt () {
    
    inquirer
        .prompt({
        type: "list",
        name: "prompt",
        message: "Would you like to do?",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department",
            "Quit"
        ]})
        .then((answer) => {
            switch (answer.prompt) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                
                case "Add Employee":
                    AddEmployee();
                    break;
            
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                    
                case "View All Roles":
                    viewAllRoles();
                    break;
                
                case "Add Role":
                    addRole();
                    break;

                case "View All Departments":
                    viewAllDepartments();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Quit":
                    connection.end();
                    break;
            }
        })
};

function viewAllEmployees() {
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employees e
    JOIN roles r
      ON e.role_id = r.id
    JOIN departments d
    ON d.id = r.department_id
    LEFT JOIN employees m
      ON m.id = e.manager_id`;

    connection.query(sql, (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        initPrompt();
    })
};

console.log(
    "=================================================\r\n  ______                 _                       \r\n |  ____|               | |                      \r\n | |__   _ __ ___  _ __ | | ___  _   _  ___  ___ \r\n |  __| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\\r\n | |____| | | | | | |_) | | (_) | |_| |  __\/  __\/\r\n |______|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|\r\n |  \\\/  |         | |             __\/ |          \r\n | \\  \/ | __ _ _ _|_| __ _  __ _ |___\/_ __       \r\n | |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__|      \r\n | |  | | (_| | | | | (_| | (_| |  __\/ |         \r\n |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|         \r\n                            __\/ |                \r\n                           |___\/                 \r\n================================================="
);

initPrompt();