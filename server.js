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

// Displays options of work to do
function initPrompt() {

    // Display list, and run the corresponding function
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
            ]
        })
        .then((answer) => {
            console.log(answer.prompt);
            switch (answer.prompt) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "Add Employee":
                    addEmployee();
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
    
    // SQL query for a table conaining all employee data along with their corresponding role title and salary, department name, and manager
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

function viewAllRoles() {

    // SQL query for displaying all role data and their corresponding department name
    const sql = `SELECT r.id, r.title, r.salary, d.name AS department
                 FROM roles r
                 JOIN departments d
                    ON r.department_id = d.id`;

    connection.query(sql, (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        initPrompt();
    })
};

function viewAllDepartments() {
    const sql = `SELECT * FROM departments`;

    connection.query(sql, (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        initPrompt();
    })
};

function addEmployee() {
    
    // Query for role data
    connection.query( `SELECT * FROM roles`, (err, res) => {
        if (err) {
            throw err;
        }

        // Create an array of objects containing each role's name and id
        const roles = res.map(({ title, id }) => ({ name: `${title}`, value: id }));

        // Query for employee data
        connection.query( `SELECT * FROM employees`, (err, res) => {
            if (err) {
                throw err;
            }

            // Create an array of objects containing each employee's first name and id
            let managers = res.map(({ first_name, id }) => ({ name: `${first_name}`, value: id }));
            // Add option for no manager
            managers.unshift({ name: 'None', value: null })

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "first_name",
                        message: "What is this employee's first name?"
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "What is this employee's last name?"
                    },
                    {
                        type: "list",
                        name: "roleName",
                        message: "What is the role of this employee?",
                        choices: roles
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is this employee's manager?",
                        choices: managers
                    },

                ])
                .then((answer) => {
                    connection.query(`INSERT INTO employees SET ?`, 
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.roleName,
                        manager_id: answer.manager
                    });
                    console.log('\nEmployee Added!\n');
                    
                    initPrompt(); 
                });
                });
            });  
};

function addRole() {

        connection.query( `SELECT * FROM departments`, (err, res) => {
            if (err) {
                throw err;
            }
            const departments = res.map(({ name, id }) => ({ name: `${name}`, value: id }));

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "title",
                        message: "What is this title of this role?"
                    },
                    {
                        type: "input",
                        name: "salary",
                        message: "What is the salary of this role?"
                    },
                    {
                        type: "list",
                        name: "department",
                        message: "What department is the role in?",
                        choices: departments
                    },
                ])
                .then((answer) => {

                    // Insert created role into roles table
                    connection.query(`INSERT INTO roles SET ?`, 
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department
                    });
                    console.log('\nRole Added!\n');
                    
                    initPrompt(); 
                });
            });
};

function addDepartment() {

    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of this department?"
            },
        ])
        .then((answer) => {

            // Insert created database into databases table
            connection.query(`INSERT INTO departments SET ?`, 
            {
                name: answer.name
            });
            console.log('\nDepartment Added!\n');
            
            initPrompt(); 
        });
};

function updateEmployeeRole() {

    // Query for employee data
    connection.query( `SELECT * FROM employees`, (err, res) => {
        if (err) {
            throw err;
        }
        // Create objects containing the first name of each employee
        const employees = res.map(({ first_name }) => ({ name: `${first_name}` }));

        // Query for role data
        connection.query( `SELECT * FROM roles`, (err, res) => {
            if (err) {
                throw err;
            }
            // Create objects containing the title and id of each role
            const roles = res.map(({ title, id }) => ({ name: `${title}`, value: id }));

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Which employees role will be updated?",
                        choices: employees
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What will the new role be?",
                        choices: roles
                    },
                ])
                .then((answer) => {
                    // Update the role_id to the chosen role for the employee
                    connection.query(`UPDATE employees SET role_id = ? WHERE first_name = ?`, 
                    [
                        answer.role,
                        answer.employee
                    ]);
                    console.log('\nEmployee Role Updated!\n');
                    
                    initPrompt(); 
                });
            });
        });
};

// Employee Manager Logo
console.log(
    "=================================================\r\n  ______                 _                       \r\n |  ____|               | |                      \r\n | |__   _ __ ___  _ __ | | ___  _   _  ___  ___ \r\n |  __| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\\r\n | |____| | | | | | |_) | | (_) | |_| |  __\/  __\/\r\n |______|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|\r\n |  \\\/  |         | |             __\/ |          \r\n | \\  \/ | __ _ _ _|_| __ _  __ _ |___\/_ __       \r\n | |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__|      \r\n | |  | | (_| | | | | (_| | (_| |  __\/ |         \r\n |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|         \r\n                            __\/ |                \r\n                           |___\/                 \r\n================================================="
);

initPrompt();