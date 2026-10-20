import express from 'express';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', requireAdmin, (req, res) => {
  return res.json({
    ok: true,
    overview: {
      revenue: 125000,
      orders: 284,
      visitors: 2351,
      pendingOrders: 8,
      lowStockProducts: 12,
      topProduct: 'Aromatic Apricot',
    },
  });
});

export { router as adminRouter };
