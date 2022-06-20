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

import * as Firebase from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where, setDoc, CollectionReference, Firestore }  from 'firebase/firestore';

import { prodConfig } from '../../firebase';
const firebaseApp = Firebase.initializeApp(prodConfig);

import { Result } from '../../common/common.types';
import { IContractDoc } from '../../types/contracts.types';

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
            let docs: IContractDoc[] = [];
            snapshot.docs.map(d => {
                const contCollection = collection(db, collPath + '/' + d.id + '/Contracts');

                console.log(d.data().prjName, d.id);

                getDocs(contCollection)
                    .then(snapshot => {

                        snapshot.docs.map(c => {
                            let contid = sha1(c.data().contName + (new Date()));
                            console.log('Project Name: ', d.data().prjName);

                            connectionPool.query('INSERT INTO contracts '
                                + '(contID, contName, contDescription, contactEmail, contactPerson, effectiveDate,'
                                + ' expiryDate, clID, prjID, created_by, created_on) '
                                + 'VALUES (?, ?, ?, ?, ?, ?, ?, '
                                + '(SELECT clID FROM projects WHERE prjName = \'' + d.data().prjName + '\'), '
                                + '(SELECT prjID FROM projects WHERE prjName = \'' + d.data().prjName + '\'), '
                                + '?, ?)', 
                                [
                                    contid,
                                    c.data().contName,
                                    c.data().Description,
                                    c.data().contactEmails,
                                    c.data().contactPerson,
                                    c.data().effectDate,
                                    c.data().expiryDate,
                                    'System - Migration',
                                    new Date()
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

                        })
                    })
                
                
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
