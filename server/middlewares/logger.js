const logger=(req,res,next)=>{
  const start=Date.now();

  const originalResponse=res.send;
  const originalJson=res.json;

  let responseBody;

  res.send=function (body){
    responseBody=body;
    return originalResponse.call(this,body)
  }

  res.json=function (body){
    responseBody=body;
    return originalJson.call(this,body)
  }

  res.on('finish',()=>{
    const timestamp=(new Date()).toISOString();
    const duration=Date.now()-start;
    
    const userId= req.user?._id||'ANONYMUS';
    const email=req.user?.email||'NO - EMAIL';

    const logEntry={
      timestamp,
      duration,
      method:req.method,
      url:req.url,
      status:res.statusCode,
      ip:req.ip||req.connection.remoteAdress,
      userAgent: req.get('User-Agent'),
      user:{
        id:userId,
        email
      }
    }

    if(req.method!=='GET')
    {
      const safeBody={...req.body};

      if(safeBody.password) delete safeBody.password;

      logEntry.requestBody=safeBody
      logEntry.responseBody=responseBody;

      if(res.statusCode>=500)
      {
         console.error('SERVER ERROR ',logEntry)
      }
      else if(res.statusCode>=400)
      {
        console.error('CLIENT ERROR ',logEntry)
      }
      else
      {
        console.log('SUCCESS ',logEntry)
      }
    }
  })
  next();
}

module.exports=logger;