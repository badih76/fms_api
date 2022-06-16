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

import * as Firebase from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where, setDoc, CollectionReference, Firestore }  from 'firebase/firestore';

import { prodConfig } from '../../firebase';
const firebaseApp = Firebase.initializeApp(prodConfig);


import { IProjectDoc } from '../../types/projects.types';
import { Result } from '../../common/common.types';

const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.get('/', (req: express.Request, res: express.Response) => { 
    // get all clients
    const collPath = '/Projects';

    let db = getFirestore(firebaseApp);
    const clCollection = collection(db, collPath);

    getDocs(clCollection)
        .then(snapshot => {
            let docs: IProjectDoc[] = [];
            snapshot.docs.map(d => {
                // {...d.data(), id: d.id.toString()}
                let prjid = sha1(d.data().prjName + (new Date()));
                // docs.push({
                //     clID: clid,
                //     clName: d.data().clName,
                //     SitesCount: d.data().SitesCount,
                //     clAddress: d.data().clAddress,
                //     clContactName: d.data().clContactNumber,
                //     clContactNumber: d.data().clContactNumber,
                //     clEmail: d.data().clEmail
                // });   
                
                connectionPool.query('INSERT INTO projects '
                    + 'VALUES (?, ?, ?, ?, '
                    + '(SELECT clID FROM clients WHERE clName = \'' + d.data().clientName + '\'))', 
                    [   
                        prjid,  
                        d.data().prjName, 
                        d.data().prjDescription, 
                        '',
                        d.data().clID
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
                            console.log(results);
                        }
                        catch(err) {
                            console.log(err);
                        }
                        
                });
            });


            let result: Result = {
                resultStatus: 200,
                resultDesc: "Successful",
                resultReturn: {},
                errorDesc: null
            }

            res.send(result);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });


    
});


export default router;
