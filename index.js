//console.log('hello')
/*
*features
* definting schema
*category,amount,date
*/
const express = require('express')
const mongoose =require('mongoose')
const bodyparser =require('body-parser')
const  { Expense } = require('./schema.js')
const app=express()
app.use(bodyparser.json())

//database connection

    async function connectToDb(){
        try{ 
    await mongoose.connect('mongodb+srv://monisa:moni2107@cluster0.h63yzr1.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=Cluster0')
    console.log("db connection establishd")
    const port=process.env.PORT ||8000
    app.listen(port,function(){
        console.log(`listening to port ${port}`)
    
    })
}

 
catch(e){
    console.log(e)
    console.log('could not estabilsh')
}
    }
connectToDb()
app.post('/add-expense', async function(request,response){
    try{

     await Expense.create({
        "amount":request.body.amount,
        "category":request.body.category,
        "date":request.body.date
    })
    response.status(201).json({
        "status":"sucess",
        "message":"new entry created"
    })}
    catch(error){
        response.status(201).json({
            "status":"failure",
            "message":"entry not created"
        })
    }
   /* console.log(request.body)
    response.json({
        "status":"created"
    })*/
})
app.get('/get-expense',async function(request,response){
    try{
    
    const expenseData = await  Expense.find()
    response.status(200).json(expenseData)}
    catch(error){
    response.status(500).json({
        "status":"failure",
        "message":"could not fetch",
        "error":error
    })
}
})
app.delete('/delete-expense/:id', async function(request,response){
    try{
    const expenseData = await Expense.findById(request.params.id)
    if(expenseData){
         await Expense.findByIdAndDelete(request.params.id)
        response.status(200).json({
            "status":"success",
            "message":"deleted entry",
        })
    }else{
        response.status(404).json({
            "status":"failure",
            "message":"could not delete entry"
        })    }
    }
    catch(error){
        response.status(500).json({
            "status":"failure",
            "message":"counld not delete entry",
            "error":error
        })
    }
})
app.patch("/edit-expense/:id", async function(request,response){
        try{
            const expenseentry = await Expense.findById(request.params.id)
            if(expenseentry){
                await expenseentry.updateOne({
                    "amount":request.body.amount,
                    "category":request.body.category,
                     "date" :request.body.date               
                    })
                    response.status(200).json({
                        "status":"success",
                        "message":"updated"
                    })
            }
            else{
                response.status(404).json({
                    "status":"failure",
                    "message":"could not find"

                })
            }
        }catch(error){
            response.status(500).json({
                "status":"failure",
                "message":"counld not delete entry",
                "error":error
            })
                }

        })