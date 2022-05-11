const router = require('express').Router()
const authCon = require('./app/Http/AuthenticationController')
const adminCon = require('./app/Http/Admin/AdminController')
const projectCon = require('./app/Http/ProjectController')
const discordCon = require('./app/Http/ServiceControllers/DiscordController')
const homeCon = require('./app/Http/HomeController')
const TrelloAPI = require('./trello/trelloApi')
const githubAPI = require('./app/Http/GithubController')
const middleware = require('./app/Middleware/Authorization')
const calEventCon = require('./app/Http/CalEventController')

const { createAccountLimit, loginLimit, mailLimit } = require('./app/Middleware/Rate')
const { authenticateValidation, registerValidation } = require('./app/Validation/AuthValidation')
/**
 * This web file is the router used to describe the correspondence
 * between the URL and the controller that will perform the action.
 */

// Home
router.get('/', homeCon.showHome)
router.get('/home', homeCon.showHome)

// Authentication
router.get('/login', authCon.showLogin)
router.get('/register', authCon.showRegister)
router.get('/forgot', authCon.showForgot)
router.get('/reset', authCon.showReset)
router.post('/authenticate', loginLimit, authenticateValidation, authCon.authenticate)
router.post('/signup', createAccountLimit, registerValidation, authCon.signup)
router.post('/logout', middleware.authLogin, authCon.logout)
router.post('/resetpass', mailLimit, authCon.resetPass)
router.post('/updatepass', authCon.updatePass)

// Project overview GET
router.get('/projects', middleware.authLogin, projectCon.showProjects)
router.get('/create-project', middleware.authLogin, projectCon.showCreateProject)
router.get('/project/:id', middleware.authLogin, projectCon.showProject)
router.get('/edit-project/:id', middleware.authLogin, projectCon.showEditProject)

// Project overview POST
router.post('/create-project', middleware.authLogin, projectCon.newProject)
router.post('/edit-project', middleware.authLogin, projectCon.updateProject)
router.post('/leave-project', middleware.authLogin, projectCon.leaveProject)
router.post('/delete-project', middleware.authLogin, projectCon.delProject)

// Admin (TODO: check for role)
router.get('/admin/board', middleware.authLogin, adminCon.showBoard)

// Discord
router.get('/discord', discordCon.discordAuth)
router.post('/discord', discordCon.discordAuth)

// Trello
router.get('/trello/:id', middleware.authLogin, TrelloAPI.trello)
router.get('/trello/callback/:id', middleware.authLogin, TrelloAPI.recieveToken)
router.get('/trello/newCard/:id', middleware.authLogin, TrelloAPI.newCard)
router.get('/trello/createCard/:id', middleware.authLogin, TrelloAPI.createCard)
router.get('/trello/setup/:id', middleware.authLogin, TrelloAPI.setupTrello)
router.get('/trello/activate/:id', middleware.authLogin, TrelloAPI.activateTrello)

// Trello API
router.get('/api/trello/boards/:id', TrelloAPI.listBoards)
router.get('/api/trello/lists/:id', TrelloAPI.listLists)

// Github API
router.get('/api/github', githubAPI.page)
router.post('/api/github/webhook', githubAPI.webHookReceiver)

// Calendar events
router.post('/add-event/:id', calEventCon.addEventToDb)
router.get('/get-events/:id', calEventCon.getEventsFromDb)

//  The 404 Route (ALWAYS Keep this as the last route)
router.get('*', (req, res) => res.status(404).render('404'))

module.exports = router
