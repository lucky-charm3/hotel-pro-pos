const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const { schemaValidator } = require('../middlewares/validator'); 
const { createReportValidator } = require('../validators/reportValidator');

router.get('/', authMiddleware, reportController.getAllReports);
router.get('/:id', authMiddleware, reportController.getReportById);
router.get('/:id/download', authMiddleware, reportController.downloadReportCSV);
router.get('/:id/print', authMiddleware, reportController.printReportHTML);

router.post('/generate', authMiddleware, schemaValidator(createReportValidator),reportController.generateReport);

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), reportController.deleteReport);

module.exports = router;