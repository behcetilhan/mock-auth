require('dotenv').config()
const express = require('express')
const fs = require('fs')
const https = require('https')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const path = require('path')

const app = express()
const PORT = 3001

app.use(
  cors({
    origin: 'http://localhost:5173', //  React app
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

const mockUsers = [
  {
    id: 1,
    username: 'user1',
    password: 'pass',
    avatarURL: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    username: 'user2',
    password: 'pass',
    avatarURL: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    username: 'user3',
    password: 'pass',
    avatarURL: 'https://i.pravatar.cc/150?img=3'
  }
]

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = mockUsers.find(u => u.username === username && u.password === password);

  if (user) {
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      accessToken,
      username: user.username,
      userId: user.id,
      avatarURL: user.avatarURL
    });
  } else {
    res.status(401).json({ error: 'Username or password is incorrect' });
  }
})

app.post('/logout', (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(0)
  });

  res.status(204).send()
})

app.post('/public/refresh', (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) {
    return res.sendStatus(401) // No refresh token provided
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403) // Invalid refresh token
    }

    const newAccessToken = jwt.sign(
      { userId: user.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 15000 }
    )
    res.json({ accessToken: newAccessToken })
  })
})

app.get('/protected', authenticateToken, (req, res) => {
  const randomSuffix = Math.floor(Math.random() * 1000)
  const protectedData = {
    id: 1,
    secret: `This is protected data only accessible with a valid token. Some random number created by server: ${randomSuffix}`,
    userId: req.user.userId // From the token
  }

  res.json(protectedData)
})

// SSL Certificate options
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
}

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`)
})
