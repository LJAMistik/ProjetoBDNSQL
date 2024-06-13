import express from 'express';
import { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes';

const app:Application = express()

app.use(cors())

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT:number = parseInt(process.env.PORT ?? "8080");

app.use('/api', routes)

//Rota de conteúdo público
app.use('/', express.static('public'))

app.listen(PORT, async () => {
    console.log(`Server up on http://localhost:${PORT}`)

    try {
        await mongoose.connect(process.env.DATABASE_URL as string)
        console.log("Connected Database")
    } catch (error) {
        console.log("Error to connect Database")  
        console.log(error)      
    }
})

