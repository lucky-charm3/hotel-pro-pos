const mongoose=require('mongoose');

const dbConnect=async ()=>{
    try{
mongoose.connect(process.env.MONGO_URI ||
     'mongodb://localhost:27017/pos_system'
  )
  console.log('Connected to POS mongoose database succesfully')
    }
    catch(error)
    {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports=dbConnect;
