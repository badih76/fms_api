import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import express from 'express';
import bodyParser from 'body-parser';
import * as mysql from 'mysql';
import sha1 from 'sha1';

const connOptions = {
    connectionLimit: 10, //parseInt(<string>process.env.connectionLimit),
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
}

const connectionPool = mysql.createPool(connOptions);

import { IProject, IProjectDoc } from '../types/projects.types';
import { Result } from '../common/common.types';

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());


router.get('/healthCheck',async (req: express.Request, res: express.Response) => {
    // res.send(connOptions);
    console.log('############ Starting Health Check ############');
    try {
        console.log('############ Trying to connect to DB ############');
        console.log(connOptions);
        connectionPool.query('SELECT * FROM dependencies WHERE dbParamName = \'HostName\'', 
            function (error: mysql.MysqlError, results) {
                console.log('############ Inside Query Callback ############');
                try {
                    if (error) throw error;
                    console.log('############ Inside Query Callback Try ############');
                    let docs: object[] = [];
                    results.map(d => {
                        docs.push(d);    
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
    }
    catch(err) {
        res.send({error: err});
    }
});

router.get('/', async (req: express.Request, res: express.Response) => { 
    // get all projects

    connectionPool.query('SELECT prjID, prjName FROM projects', 
        function (error: mysql.MysqlError, results, fields: mysql.FieldInfo[]) {
            try {
                if (error) throw error;

                let docs: IProject[] = [];
                results.map(d => {
                    docs.push({
                        prjID: d.prjID,
                        prjName: d.prjName
                        
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

router.get('/projectsForClient/:clID', async (req: express.Request, res: express.Response) => { 
    // get all projects

    connectionPool.query('SELECT * FROM projects WHERE clID = ?', 
        [req.params.clID],
        function (error, results) {
            try {
                if (error) throw error;

                let docs: IProjectDoc[] = [];
                results.map(d => {
                    docs.push({
                        clientID: d.clID,
                        prjID: d.prjID,
                        prjDescription: d.prjDescription,
                        prjName: d.prjName,
                        
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
    
    const prjID = sha1(req.body.prjName+(new Date()));
    console.log("PrjID: ", prjID);
    
    connectionPool.query('INSERT INTO projects VALUES (?, ?, ?, ?, ?)', 
        [   
            prjID,  
            body.prjName, 
            body.prjDescription, 
            body.contCode,
            body.clID
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
    
    connectionPool.query('UPDATE projects '
                        + 'SET prjName = ?, '
                        + '    prjDescription = ?, '
                        + '    contCode = ? '
                        + 'WHERE prjID = ?', 
        [     
            body.prjName, 
            body.prjDescription, 
            body.contCode,
            body.prjID
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
