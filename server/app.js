const express=require('express')
const {graphqlHTTP}=require('express-graphql')
const schema=require('./schema/schema')
const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost:27017/graphql',{
    useNewUrlParser:true,   
    useUnifiedTopology:true
});
const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',()=>{
    console.log('database connected')
})

const app=express()

app.use('/graphql',graphqlHTTP({
schema,
graphiql:true
}))

app.listen(4000,()=>{
    console.log('server started')
})