import express from 'express';

const router = express.Router();

import migrateClients from './clients';
import migrateProjects from './projects';
import migrateUsers from './users';
import migrateContracts from './contracts';
import migrateStes from './sites';

router.use('/clients', migrateClients);
router.use('/projects', migrateProjects);
router.use('/users', migrateUsers);
router.use('/contracts', migrateContracts);
router.use('/sites', migrateStes);


router.get('/', async (req: express.Request, res: express.Response) => {
    res.send('Test')
});

export default router;