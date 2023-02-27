// Require dependencies
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_,
    database: 'employees_db'
});



// =================================================
//   ______                 _                       
//  |  ____|               | |                      
//  | |__   _ __ ___  _ __ | | ___  _   _  ___  ___ 
//  |  __| | '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \
//  | |____| | | | | | |_) | | (_) | |_| |  __/  __/
//  |______|_| |_| |_| .__/|_|\___/ \__, |\___|\___|
//  |  \/  |         | |             __/ |          
//  | \  / | __ _ _ _|_| __ _  __ _ |___/_ __       
//  | |\/| |/ _` | '_ \ / _` |/ _` |/ _ \ '__|      
//  | |  | | (_| | | | | (_| | (_| |  __/ |         
//  |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|         
//                             __/ |                
//                            |___/                 
// =================================================