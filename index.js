const express=require('express')
const path=require('path')
const urlRoute=require('./routes/url')
const {connectToMongoDB}=require('./connect')
const URL=require('./models/url')
const staticRoute=require('./routes/staticRouter')
const app=express()
const PORT=7000

//Connection to mongoDb
connectToMongoDB('mongodb://127.0.0.1:27017/url-shortner')
.then(()=>{
  console.log('Mongodb connected sucessfully')
})
.catch((err)=>{
  console.log('Error in connecting mongoDb',err)
})


app.set("view engine","ejs")
app.set('views',path.resolve("./views"))


//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Routes

app.use('/url',urlRoute)

app.use('/',staticRoute)


app.get('/url/:shortId',async(req,res)=>{
 
const shortId=req.params.shortId;
const entry = await URL.findOneAndUpdate({ shortId }, {
  $push: {
    visitHistory: {
     timestamp: Date.now()
    }
  }
})

res.redirect(entry.redirectURL)  
})
app.listen( PORT, ()=>console.log(`Listening on port ${PORT}`))