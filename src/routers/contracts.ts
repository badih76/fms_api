import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import express from 'express';
import bodyParser from 'body-parser';
import * as mysql from 'mysql';
import sha1 from 'sha1';

const connOptions = {
    connectionLimit: parseInt(<string>process.env.connectionLimit),
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
}

const connectionPool = mysql.createPool(connOptions);

import { IContract, IContractDoc } from '../types/contracts.types';
import { Result } from '../common/common.types';

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.get('/contractsForProject/:prjID', async (req: express.Request, res: express.Response) => { 
    // get all contracts for project
    connectionPool.query('SELECT contID, contName FROM contracts WHERE prjID = ?', [req.params.prjID], 
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IContract[] = [];
                results.map(d => {
                    docs.push({
                        contID: d.contID,
                        contName: d.contName
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

router.get('/contractID/:contID', async (req: express.Request, res: express.Response) => { 
    // get all contracts for project
    connectionPool.query('SELECT * FROM contracts WHERE contID = ?', [req.params.contID], 
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IContractDoc[] = [];
                results.map(d => {
                    docs.push({
                        contID: d.contID,
                        Description: d.contDescription,
                        contName: d.contName,
                        contactEmails: d.contactEmail,
                        contactPerson: d.contactPerson,
                        effectDate: d.effectiveDate,
                        expiryDate: d.expiryDate,
                        prjCode: d.prjCode,
                        clID: d.clID,
                        created_by: d.created_by,
                        created_on: d.created_on
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

router.post("/new", async (req: express.Request, res: express.Response) => {
    let body = req.body;
    
    const contID = sha1(req.body.contName + (new Date()));
    
    connectionPool.query('INSERT INTO contracts '
                    +   '(contID, contName, contDescription, contactEmail, contactPerson, '
                    +   ' effectiveDate, expiryDate, clID, prjID, created_by, created_on)'
                    +   'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [   
            contID,  
            body.contName, 
            body.contDescription, 
            body.contactEmail,
            body.contactPerson,
            body.effectDate,
            body.expiryDate,
            body.clID,
            body.prjID,
            body.created_by,
            new Date()
        ],
        function (error, results) {
            try {
                if (error) throw error;
                
                console.log("Result: ", results);

                let result: Result = {
                    resultStatus: 200,
                    resultDesc: "Successful",
                    resultReturn: results,
                    errorDesc: null
                }
    
                res.send(result);
            }
            catch(err) {
                res.send(err);
            }
            
    });
});

router.post("/update", async (req: express.Request, res: express.Response) => {
    let body = req.body;
        
    connectionPool.query('UPDATE contracts '
                    +   'SET contName = ?, contDescription = ?, contactEmail = ?, contactPerson = ?,'
                    +   ' effectiveDate = ?, expiryDate = ?, clID = ?, prjID = ?, updated_on = ? '
                    +   'WHERE contID = ?', 
        [   
            body.contName, 
            body.contDescription, 
            body.contactEmail,
            body.contactPerson,
            body.effectDate,
            body.expiryDate,
            body.clID,
            body.prjID,
            new Date()
        ],
        function (error, results) {
            try {
                if (error) throw error;
                
                console.log("Result: ", results);

                let result: Result = {
                    resultStatus: 200,
                    resultDesc: "Successful",
                    resultReturn: results,
                    errorDesc: null
                }
    
                res.send(result);
            }
            catch(err) {
                res.send(err);
            }
            
    });
});

export default router;
