const schemaValidator=(schema)=>{
  return (req,res,next)=>{
    const {error}=schema.validate(req.body);

    if(!error)
    {
      next();
    }

    res.status(400).json({
      success:false,
      message:error.details[0].message
    })
  }
}

const sanitize = (fields) => {
  return (req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (fields.includes(key) && typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();

          req.body[key] = req.body[key].replace(/[<>]/g, '');
          
          if (['username', 'name', 'firstName', 'lastName'].includes(key)) {
            req.body[key] = req.body[key].replace(/\w\S*/g, txt => 
              txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
          }
        }
      });
    }
    next();
  };
};

const validateFileUpload = (allowedTypes, maxSizeInMB) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (req.file.size > maxSizeInBytes) {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${maxSizeInMB}MB`
      });
    }

    next();
  };
};

module.exports = {
  schemaValidator,
  sanitize,
  validateFileUpload
};