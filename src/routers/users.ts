import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import express from 'express';
import bodyParser from 'body-parser';
import * as mysql from 'mysql';
import sha1 from 'sha1';

const connOptions = {
    connectionLimit: parseInt(<string>process.env.CONNECTIONLIMIT),
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
}

const connectionPool = mysql.createPool(connOptions);

import { IUser } from '../types/users.types';
import { Result } from '../common/common.types';

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.get('/', (req: express.Request, res: express.Response) => { 
    // get all users
    
    connectionPool.query('SELECT * FROM users', 
        function (error: mysql.MysqlError, results, fields: mysql.FieldInfo[]) {
            try {
                if (error) throw error;

                let docs: IUser[] = [];
                results.map(d => {
                    docs.push({
                        UID: d.UID,
                        UGID: d.UGID,
                        DisplayName: d.DisplayName,
                        Email: d.Email,
                        EmailVerified: d.EmailVerified,
                        Disabled: d.Disabled,
                        PhoneNumber: d.PhoneNumber,
                        PhotoURL: d.PhotoURL,
                        Password: d.Password
                    });    
                });

                let result: Result = {
                    resultStatus: 200,
                    resultDesc: "Successful",
                    resultReturn: docs,
                    errorDesc: null
                }
    
                res.send(result);
            }
            catch(err) {
                res.send(err);
            }
            
    });
});

router.get('/userID/:UID', async (req: express.Request, res: express.Response) => { 
    // get user by ID
    
    connectionPool.query('SELECT * FROM users WHERE UID = ?', [req.params.UID], 
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IUser[] = [];
                results.map(d => {
                    docs.push({
                        UID: d.UID,
                        UGID: d.UGID,
                        DisplayName: d.DisplayName,
                        Email: d.Email,
                        EmailVerified: d.EmailVerified,
                        Disabled: d.Disabled,
                        PhoneNumber: d.PhoneNumber,
                        PhotoURL: d.PhotoURL,
                        Password: d.Password
                    });    
                });

                let result: Result = {
                    resultStatus: 200,
                    resultDesc: "Successful",
                    resultReturn: docs,
                    errorDesc: null
                }
    
                res.send(result);
            }
            catch(err) {
                res.send(err);
            }
            
    });
    
});

router.get('/userDisplayName/:displayName', async (req: express.Request, res: express.Response) => { 
    // get users by Display Name
    console.log(req.params.displayName);
    
    connectionPool.query('SELECT * FROM users WHERE DisplayName LIKE ?', ['%' + req.params.displayName + '%'], 
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IUser[] = [];
                results.map(d => {
                    docs.push({
                        UID: d.UID,
                        UGID: d.UGID,
                        DisplayName: d.DisplayName,
                        Email: d.Email,
                        EmailVerified: d.EmailVerified,
                        Disabled: d.Disabled,
                        PhoneNumber: d.PhoneNumber,
                        PhotoURL: d.PhotoURL,
                        Password: d.Password
                    });    
                });

                let result: Result = {
                    resultStatus: 200,
                    resultDesc: "Successful",
                    resultReturn: docs,
                    errorDesc: null
                }

                res.send(result);
            }
            catch(err) {
                res.send(err);
            }
            
    });
});

// router.get('/clientName/:clName', async (req: express.Request, res: express.Response) => { 
//     // get all clients
    
//     connectionPool.query('SELECT * FROM clients WHERE clName LIKE ?', ['%' + req.params.clName + '%'], 
//         function (error, results) {
//             try {
//                 if (error) throw error;

//                 let docs: FClient[] = [];
//                 results.map(d => {
//                     docs.push({
//                         clID: d.clID,
//                         SitesCount: 0,
//                         clAddress: d.clAddress,
//                         clContactName: d.clContactName,
//                         clContactNumber: d.clContactNumber,
//                         clEmail: d.clEmail,
//                         clName: d.clName
//                     });    
//                 });

//                 let result: Result = {
//                     resultStatus: 200,
//                     resultDesc: "Successful",
//                     resultReturn: docs,
//                     errorDesc: null
//                 }

                
    
//                 res.send(result);
//             }
//             catch(err) {
//                 res.send(err);
//             }
            
//     });

// });

// router.post("/new", async (req: express.Request, res: express.Response) => {
//     let body = req.body;

//     const clID = sha1(req.body.prjName+(new Date()));
    
//     connectionPool.query('INSERT INTO clients '
//     + '(clID, clName, clContactName, clContactNumber, clEmail, clAddress, created_by, created_on) '
//     + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
//         [
//             clID,
//             body.clName,
//             body.clContactName,
//             body.clContactNumber,
//             body.clEmail,
//             body.clAddress,
//             body.created_by,
//             body.created_on
//         ], 
//         function (error, results) {
//             try {
//                 if (error) throw error;

//                 let result: Result = {
//                     resultStatus: 200,
//                     resultDesc: "Successful",
//                     resultReturn: results,
//                     errorDesc: null
//                 }

                
    
//                 res.send(result);
//             }
//             catch(err) {
//                 res.send(err);
//             }
            
//     });
// })

export default router;
