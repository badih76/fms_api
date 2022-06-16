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
import { getFirestore, collection, getDocs }  from 'firebase/firestore';

import { prodConfig } from '../../firebase';
const firebaseApp = Firebase.initializeApp(prodConfig);

import { Result } from '../../common/common.types';
// import { ISite, ISiteDoc } from '../../types/sites.types';

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
            snapshot.docs.map(d => {
                const contCollection = collection(db, collPath + '/' + d.id + '/Contracts');

                getDocs(contCollection)
                    .then(snapshot => {

                        snapshot.docs.map(c => {
                            const sitesCollection = collection(db, collPath + '/' + d.id + '/Contracts/' + c.id + '/Assets');

                            getDocs(sitesCollection)
                                .then(snapshot => {
                                    
                                    snapshot.docs.map(s => {
                                        let siteid = sha1(s.data().Title + (new Date()));

                                        connectionPool.query('INSERT INTO sites '
                                            + '(siteID, contID, siteTitle, SiteDescription, siteLocation, siteRemarks, siteCategory) '
                                            + 'VALUES (?, '
                                            + '(SELECT contID FROM contracts '
                                            + '     INNER JOIN projects ON projects.prjID = contracts.prjID'
                                            + ' WHERE prjName = \'' + d.data().prjName + '\' AND contName = \'' + c.data().contName + '\'), '
                                            + '?, ?, ?, ?, ?)', 
                                            [
                                                siteid,
                                                s.data().Title,
                                                s.data().Description,
                                                s.data().Location,
                                                s.data().Remarks,
                                                s.data().Title.toUpperCase().indexOf('POOL') > 0 ? 'Pool' : ''
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

                            })

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
