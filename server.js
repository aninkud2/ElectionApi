const express =require("express")
const mongoose = require("mongoose")
const port=3434
 
const app=express()
app.use(express.json())


const electionSchema =new mongoose.Schema({
state:{
    type:String,
    required:[true,"State is required"]},

parties:{
    type:Array,
    required:[true,"parties is required"]
},

result:{
    type:Object,
    required:[true,"result is required"]
    },
collationOfficer:{
    type:String,
    required:[true,"C.O is required"]}
    ,

isRigged:{
    type:Boolean,
    required:[true,"isRigged is required"]},
totalLg:{
    type:Number,

      required:[true,"Total lg is required"]},
  winner:String,
},


{
    timestamps: true
}
)


const electionmodel=mongoose.model("Presidential Election",electionSchema)


app.get("/",(req,res)=>{

    res.send("WELCOME TO OUR ELECTION API HOMEPAGE")
} )


app.post("/create",async(req,res)=>{
try {
    // if(typeof req.body.state !== "string"){
    //     res.send("Please send ur state as a string data")
    //     // console.log(typeof req.body.state)
    // }else{
    const newEntry = await  electionmodel.create(req.body)
    res.status(200).json({message:`${electionmodel.length} user has been created`, data:newEntry})
    console.log(JSON.stringify(newEntry.result.pdp))
} catch (error) {
    res.status(400).json(error.message)
 
}

})

app.get("/getall",async(req,res)=>{
try {
     const allResult= await electionmodel.find()
     if(!allResult){res.send("No results available yet")}
     else{res.status(200).json({Message:"Find available results below",data:allResult})}
    
} catch (error) {
    res.status(400).json(error.message)   
}



})


// to find all rigged election


app.get("/riggedelection",async(req,res)=>{

try {
   const rigged= await electionmodel.find({isRigged:true})
   res.status(200).json({Message:"The states elections were rigged",data:rigged})
    
} catch (error) {
    res.status(404).json(error.message)    
}

})
 
//Double collation Officer


app.get("/double",async(req,res)=>{

    try {
       const rigged= await electionmodel.find({collationOfficer:req.body.collationOfficer})
       res.status(200).json({Message:`${req.body.collationOfficer} conducted this  elections`,data:rigged})
        
    } catch (error) {
        res.status(404).json(error.message)    
    }
    
}
)
//OR
app.get("/double/:co",async(req,res)=>{

    try {
       const rigged= await electionmodel.find({collationOfficer:req.params.co})
       res.status(200).json({Message:`${req.params.co} conducted this  elections`,data:rigged})
        
    } catch (error) {
        res.status(404).json(error.message)    
    }
    
}
)

//delete rigged

app.delete("/deleteriggedelection",async(req,res)=>{

    try {
       const drigged= await electionmodel.find({isRigged:false})
       const rigged= await electionmodel.deleteMany({isRigged:false})

       res.status(200).json({Message:"The following states elections were annulled and canceled ",data:[drigged,rigged]})
        
    } catch (error) {
        res.status(404).json(error.message)    
    }
    
    })





mongoose.connect("mongodb+srv://ajoluwatimilehin:ATloqRN8RpY6Z0Zi@cluster0.kdxpgkz.mongodb.net/").then(
()=>{console.log("Connection to the database is successful")}
).catch(
  (error)=>{console.log(error.message)}  
)
app.listen(port,()=>{console.log("working on port "+port)})