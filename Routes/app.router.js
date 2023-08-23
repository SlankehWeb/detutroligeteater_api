import express from 'express'
const AppRouter = express.Router()
import ActorController from '../App/Controllers/actor.controller.js'
import EventController from '../App/Controllers/event.controller.js'
import { Authorize } from '../Middleware/auth.js'

// Event Routes
const eventcontrol = new EventController
AppRouter.get('/events', (req, res) => { eventcontrol.list(req, res) })
AppRouter.get('/events/:id([0-9]*)', (req, res) => { eventcontrol.details(req, res) })
AppRouter.post('/events', (req, res) => { eventcontrol.create(req, res) })
AppRouter.delete('/events', (req, res) => { eventcontrol.remove(req, res) })


export default AppRouter