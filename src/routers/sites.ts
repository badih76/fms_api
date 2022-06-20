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

import { ISite, ISiteDoc } from '../types/sites.types';
import { Result } from '../common/common.types';

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.get('/sitesForContract/:contID', async (req: express.Request, res: express.Response) => { 
    // get all projects

    connectionPool.query('SELECT siteID, siteTitle FROM sites WHERE contID = ?', 
        [req.params.contID],
        function (error, results) {
            try {
                if (error) throw error;

                let docs: ISite[] = [];
                results.map(d => {
                    docs.push({
                        siteID: d.siteID,
                        siteTitle: d.siteTitle
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

router.get('/sitesID/:siteID', async (req: express.Request, res: express.Response) => { 
    // get all projects

    connectionPool.query('SELECT * FROM sites WHERE siteID = ?', 
        [req.params.siteID],
        function (error, results) {
            try {
                if (error) throw error;

                let docs: ISiteDoc[] = [];
                results.map(d => {
                    docs.push({
                        siteID: d.siteID,
                        siteTitle: d.siteTitle,
                        siteDescription: d.siteDescription,
                        siteLocation: d.siteLocation,
                        siteRemarks: d.siteRemarks,
                        siteCategory: d.siteCategory
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


export default router;