import { Router } from 'express';
import { PARAM_OPTIONS } from '../features/ConditionBuilder/config/paramOptions';

const router = Router();

router.get('/', (req, res) => {
  const type = req.query.type as string;

  // If no query provided, list all available types
  if (!type) {
    return res.json({ availableTypes: Object.keys(PARAM_OPTIONS) });
  }

  const value = PARAM_OPTIONS[type];

  if (!value) {
    return res.status(400).json({ error: `Invalid type "${type}". Try one of: ${Object.keys(PARAM_OPTIONS).join(', ')}` });
  }

  return res.json(value);
});

export default router;
