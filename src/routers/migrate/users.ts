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

import { Result } from '../../common/common.types';

export interface ClientDoc {
    UID: string,
    UserGroup: string,
    disabled: boolean,
    displayName: string,
    email: string, 
    emailVerified: boolean,
    password: string,
    phoneNumber: string,
    photoURL: string,
}


const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.get('/', (req: express.Request, res: express.Response) => { 
    // get all clients
    const collPath = '/Users/docUsers/colUsers';

    let db = getFirestore(firebaseApp);
    const clCollection = collection(db, collPath);

    getDocs(clCollection)
        .then(snapshot => {
            let docs: ClientDoc[] = [];
            snapshot.docs.map(d => {
                // {...d.data(), id: d.id.toString()}
                let uid = sha1(d.data().UID + (new Date()));
                // console.log(d.data());
                // docs.push({
                //     UID: d.data(),
                //     UserGroup: string,
                //     disabled: boolean,
                //     displayName: string,
                //     email: string, 
                //     emailVerified: boolean,
                //     password: string,
                //     phoneNumber: string,
                //     photoURL: string,
                // });   
                
                connectionPool.query('INSERT INTO users '
                    + '(UID, UGID, DisplayName, Email, EmailVerified, Disabled, PhoneNumber, PhotoURL, Password) '
                    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                    [
                        uid,
                        0,
                        d.data().displayName,
                        d.data().email,
                        d.data().emailVerified,
                        d.data().disabled,
                        d.data().phoneNumber,
                        d.data().photoURL,
                        d.data().password
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
