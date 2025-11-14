const bcrypt = require('bcrypt')
const express = require('express')
const { PrismaClient } = require('@prisma/client')
var jwt = require('jsonwebtoken');
const prisma = new PrismaClient()
const app = express()
app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001',  // your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body
    // Need to checj whether user already exists
    const user = await prisma.food.findUnique({
        where: { email }
    })
    if (user) {
        return res.status(422).json({ message: "User Already exists" })
    } else {
        // In this case we need to insert or add user in db 
        // we do not want to store password directly we want to hased it first
        // hashing the password
        try {
            const hashedPassword = await bcrypt.hash(password, 10)

            await prisma.food.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword
                }
            })
            return res.status(201).json({ message: "User Create Successfully!" })

        } catch {
            return res.status(500).json({ message: "Something went wrong" })

        }


    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // we need to check use existt
    const user = await prisma.food.findUnique({
        where: { email }
    })
    if (!user) {
        return res.status(422).json({ message: "User does not exists" })
    } else {
        // password check
        const isPasswrodMatch = bcrypt.compareSync(password, user.password);
        if (isPasswrodMatch) {
            //  read jsonweb token how to create jwt token
            const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {expiresIn: '7d'})
            const refresh_token = jwt.sign({ email: user.email }, process.env.refresh_SECRET_KEY, {expiresIn: '30d'})

            return res.status(200).json({ token: token, email: email, refresh_token:refresh_token})
        } else {
            return res.status(401).json({ message: "Password is incorrect." })
        }
    }

})

async function isValidToken(req, res, next) {
    try {
        const token = req.headers?.authorization?.split(' ')?.[1] || 'acscvdfv';
        const isTokenVerified = await jwt.verify(token, process.env.SECRET_KEY)
        if (isTokenVerified) {
            next()
        } else {
            return res.status(401).json({ message: "You are not authorized!!" })
        }
    } catch (error) {
        return res.status(401).json({ message: "You are not authorized!!" })
    }
}

app.get("/users", isValidToken, async (req, res) => {
    const users = await prisma.food.findMany();
    return res.status(200).json({ data: users })
})

const port = 3000
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
});








// require('dotenv').config();
// const {PrismaClient} = require("@prisma/client");
// const prisma = new PrismaClient();
// const express = require('express')
// const app = express()
// app.use(express.json())

// // Test database connection on startup
// async function connectDB() {
//     try {
//         await prisma.$connect();
//         console.log('Database connected successfully');
//     } catch (error) {
//         console.error('Database connection error:', error.message);
//     }
// }

// connectDB();

// app.get('/food', async (req, res) => {
//     try {
//         const data = await prisma.food.findMany()
//         res.status(200).json({data: data})
//     } catch (error) {
//         console.error('Error fetching food:', error);
//         res.status(500).json({message: 'Something went wrong'})
//     }
// })

// app.get('/', (req, res) => {
//     res.status(200).json({message: 'Server is running'})
// })

// app.listen(3000, (error)=>{
//     if (error) {
//         console.error('Error starting server:', error);
//     } else {
//         console.log('Server started on port 3000');
//     }
// })

// // Graceful shutdown
// process.on('beforeExit', async () => {
//     await prisma.$disconnect();
// })