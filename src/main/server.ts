import { env } from './config/env'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { router } from '../infra/http/routes'

const app = express()

// Security headers (XSS, clickjacking, MIME-sniffing, etc.)
app.use(helmet())

// CORS — restrict to specific origins in production via ALLOWED_ORIGINS env var
app.use(
    cors({
        origin: env.NODE_ENV === 'production' ? (process.env.ALLOWED_ORIGINS ?? '').split(',').filter(Boolean) : '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
)

// Global rate limiter: 100 requests per 15 min per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
})

// Auth rate limiter: 10 requests per 15 min per IP (brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts, please try again later.' },
})

app.use(globalLimiter)
app.use('/auth', authLimiter)

// Limit body size to 10 kb to prevent large-payload attacks
app.use(express.json({ limit: '10kb' }))

// If running behind a reverse proxy (nginx, Railway, Render), uncomment:
// app.set('trust proxy', 1)

app.use(router)

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`))
