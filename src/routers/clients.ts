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

import { IClientDoc, IClient } from '../types/clients.types';
import { Result } from '../common/common.types';

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.get('/', (req: express.Request, res: express.Response) => { 
    // get all clients
    console.log(connOptions);
    
    connectionPool.query('SELECT clID, clName FROM clients', 
        function (error: mysql.MysqlError, results, fields: mysql.FieldInfo[]) {
            try {
                if (error) throw error;

                let docs: IClient[] = [];
                results.map(d => {
                    docs.push({
                        clID: d.clID,
                        clName: d.clName
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

router.get('/clientID/:clID', async (req: express.Request, res: express.Response) => { 
    // get all clients
    
    connectionPool.query('SELECT * FROM clients WHERE clID = ?', [req.params.clID], 
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IClientDoc[] = [];
                results.map(d => {
                    docs.push({
                        clID: d.clID,
                        SitesCount: 0,
                        clAddress: d.clAddress,
                        clContactName: d.clContactName,
                        clContactNumber: d.clContactNumber,
                        clEmail: d.clEmail,
                        clName: d.clName
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

router.get('/exactClientName/:clName', async (req: express.Request, res: express.Response) => { 
    // get all clients
    
    connectionPool.query('SELECT clID, clName FROM clients WHERE clName = ?', [req.params.clName], 
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IClient[] = [];
                results.map(d => {
                    docs.push({
                        clID: d.clID,
                        clName: d.clName
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

router.get('/clientName/:clName', async (req: express.Request, res: express.Response) => { 
    // get all clients
    
    connectionPool.query('SELECT * FROM clients WHERE clName LIKE ?', ['%' + req.params.clName + '%'], 
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IClient[] = [];
                results.map(d => {
                    docs.push({
                        clID: d.clID,
                        clName: d.clName
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

    const clID = sha1(req.body.prjName+(new Date()));
    
    connectionPool.query('INSERT INTO clients '
    + '(clID, clName, clContactName, clContactNumber, clEmail, clAddress, created_by, created_on) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [
            clID,
            body.clName,
            body.clContactName,
            body.clContactNumber,
            body.clEmail,
            body.clAddress,
            body.created_by,
            body.created_on
        ], 
        function (error, results) {
            try {
                if (error) throw error;

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

    const clID = sha1(req.body.prjName+(new Date()));
    
    connectionPool.query('UPDATE clients '
                        + 'SET clName = ?,'
                        + '    clContactName = ?,'
                        + '    clContactNumber = ?,'
                        + '    clEmail = ?,'
                        + '    clAddress = ?,'
                        + '    updated_on = Now()'
                        + 'WHERE clID = ?', 
        [
            body.clName,
            body.clContactName,
            body.clContactNumber,
            body.clEmail,
            body.clAddress,
            body.clID
        ], 
        function (error, results) {
            try {
                if (error) throw error;

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
})

export default router;
