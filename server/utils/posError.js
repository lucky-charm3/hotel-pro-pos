class PosError extends Error{
constructor(message,statusCode){
    super(message);
    this.statusCode=statusCode||500;
    this.name=this.constructor.name;
    this.isOperational=true;

    Error.captureStackTrace(this,this.constructor)
}
}

module.exports=PosError