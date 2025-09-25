const express = require('express'),
      app = express()

app.use(express.static('public'))
app.use(express.static('views'))

const { MongoClient, ServerApiVersion } = require('mongodb')
const session = require('express-session')

// MongoDB connection setup
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

let database, tasksCollection, usersCollection

// Session configuration
app.use(session({
    secret: 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}))

// Allows us to handle JSON in certain ways on the server side
app.use(express.json())

// MongoDB connection function
async function connectToMongoDB() {
  try {
    await client.connect()
    database = client.db("myDatabase")
    tasksCollection = database.collection("tasks")
    usersCollection = database.collection("users")
    
    await client.db("myDatabase").command({ ping: 1 })
    
    return true
  } catch (error) {
    return false
  }
}

const logger = (req, res, next) => {
  next()
}

const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.status(401).json({ error: 'Authentication required' })
    }
}

app.use(logger)

// Routes

// Authentication routes
app.post('/register', async (req, res) => {
    try {
        if (!usersCollection) {
            const connected = await connectToMongoDB()
            if (!connected) {
                return res.status(500).json({ error: 'Database not connected' })
            }
        }
        
        const { username, password } = req.body
        
        const existingUser = await usersCollection.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' })
        }
        
        const newUser = {
            username,
            password,
            createdAt: new Date()
        }
        
        const result = await usersCollection.insertOne(newUser)
        res.json({ message: 'User registered successfully', userId: result.insertedId })
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' })
    }
})

app.post('/login', async (req, res) => {
    try {
        if (!usersCollection) {
            const connected = await connectToMongoDB()
            if (!connected) {
                return res.status(500).json({ error: 'Database not connected' })
            }
        }
        
        const { username, password } = req.body
        
        const user = await usersCollection.findOne({ username, password })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        
        req.session.userId = user._id.toString()
        req.session.username = username
        
        res.json({ message: 'Login successful', username })
    } catch (error) {
        res.status(500).json({ error: 'Login failed' })
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.json({ message: 'Logged out successfully' })
})

app.get('/auth/status', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true, username: req.session.username, userId: req.session.userId })
    } else {
        res.json({ authenticated: false })
    }
})

app.get('/auth.html', (req, res) => {
    res.sendFile(__dirname + '/views/auth.html')
})

app.get('/index.html', requireAuth, (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/data', requireAuth, async (req, res) => {
    try {
        if (!tasksCollection) {
            const connected = await connectToMongoDB()
            if (!connected) {
                return res.status(500).json({ error: 'Database not connected' })
            }
        }
        const tasks = await tasksCollection.find({ userId: req.session.userId }).toArray()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' })
    }
})

app.post('/submit', requireAuth, async (req, res) => {
    try {
        if (!tasksCollection) {
            const connected = await connectToMongoDB()
            if (!connected) {
                return res.status(500).json({ error: 'Database not connected' })
            }
        }
        
        const newTask = req.body
        newTask.userId = req.session.userId
        newTask.createdAt = new Date()
        
        const result = await tasksCollection.insertOne(newTask)
        res.json({ message: 'Task submitted successfully', taskId: result.insertedId })
    } catch (error) {
        res.status(500).json({ error: 'Failed to insert task' })
    }
})

app.put('/update/:id', requireAuth, async (req, res) => {
    try {
        if (!tasksCollection) {
            const connected = await connectToMongoDB()
            if (!connected) {
                return res.status(500).json({ error: 'Database not connected' })
            }
        }
        
        const taskId = req.params.id
        const { complete } = req.body
        const objectId = require('mongodb').ObjectId
        
        const result = await tasksCollection.updateOne(
            { _id: new objectId(taskId), userId: req.session.userId },
            { $set: { complete: complete } }
        )
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }
        
        const tasks = await tasksCollection.find({ userId: req.session.userId }).toArray()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' })
    }
})

app.delete('/delete/:id', requireAuth, async (req, res) => {
    try {
        if (!tasksCollection) {
            const connected = await connectToMongoDB()
            if (!connected) {
                return res.status(500).json({ error: 'Database not connected' })
            }
        }
        
        const taskId = req.params.id
        const objectId = require('mongodb').ObjectId
        
        const result = await tasksCollection.deleteOne({ 
            _id: new objectId(taskId), 
            userId: req.session.userId 
        })
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }
        
        const tasks = await tasksCollection.find({ userId: req.session.userId }).toArray()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' })
    }
})

async function startServer() {

    const connected = await connectToMongoDB()
    
    const port = process.env.PORT || 3000
    app.listen(port, () => {
    })
}

startServer().catch(() => {})	

