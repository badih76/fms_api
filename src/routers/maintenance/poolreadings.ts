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


const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

// const collPath = '/Projects';
// const firebaseApp = Firebase.initializeApp(prodConfig);


// router.get('/:prjID/:contID/:assetID', async (req: express.Request, res: express.Response) => { 
//     // get all pool readings for prj/cont/asset
//     let db: Firestore = getFirestore(firebaseApp);
//     // /Projects/Project1/Contracts/Contract1/Assets/Kids Pool
//     let newCollPath: string = collPath + '/' + req.params.prjID + '/Contracts/' 
//                     + req.params.contID + '/Assets/' + req.params.assetID + '/Readings'; 
//     const prColl: CollectionReference = collection(db, newCollPath);

//     getDocs(prColl)
//         .then(snapshot => {
//             let docs: PoolReading[] = [];
//             snapshot.docs.map(d => {
//                 // {...d.data(), id: d.id.toString()}
//                 docs.push({
//                     id: d.id,
//                     clReading: d.data().clReading,
//                     clientName: d.data().clContactName,
//                     contractName: d.data().contractName,
//                     pHReading: d.data().pHReading,
//                     poolName: d.data().poolName,
//                     projectName: d.data().projectName,
//                     transDate: d.data().transDate,
//                 });    
//             });

//             let result: Result = {
//                 resultStatus: 200,
//                 resultDesc: "Successful",
//                 resultReturn: docs,
//                 errorDesc: null
//             }

//             res.send(result);
//         })
//         .catch(err => {
//             console.log(err);
//             res.send(err);
//         });
// });

export default router;
