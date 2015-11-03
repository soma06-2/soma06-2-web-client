import { Router } from 'express';
import dummy from './dummyData';

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(dummy);
  }
  catch (e) {
    return next(e);
  }
});

export default router;
