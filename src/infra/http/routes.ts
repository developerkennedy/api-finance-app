import { Router } from 'express'
import { makeCreateCategoryController } from '../../auth/category.auth'
import { makeListCategoriesController } from '../../auth/list-categories.auth'
import { makeEnsureAuthenticatedMiddleware } from '../../auth/ensure-authenticated.auth'
import { makeRefreshTokenController } from '../../auth/refresh-token.auth'
import { makeLogoutController } from '../../auth/logout.auth'
import { makeLoginController } from '../../auth/login.auth'
import { makeMeController } from '../../auth/me.auth'
import { makeRegisterController } from '../../auth/register.auth'
import { makeCreateTransactionController } from '../../auth/create-transaction.auth'
import { makeListTransactionsController } from '../../auth/list-transactions.auth'
import { makeGetTransactionController } from '../../auth/get-transaction.auth'
import { makeUpdateTransactionController } from '../../auth/update-transaction.auth'
import { makeDeleteTransactionController } from '../../auth/delete-transaction.auth'

const router = Router()

const auth = makeEnsureAuthenticatedMiddleware()

const registerController = makeRegisterController()
const loginController = makeLoginController()
const refreshTokenController = makeRefreshTokenController()
const logoutController = makeLogoutController()
const meController = makeMeController()
const createCategoryController = makeCreateCategoryController()
const listCategoriesController = makeListCategoriesController()
const createTransactionController = makeCreateTransactionController()
const listTransactionsController = makeListTransactionsController()
const getTransactionController = makeGetTransactionController()
const updateTransactionController = makeUpdateTransactionController()
const deleteTransactionController = makeDeleteTransactionController()

// Public routes
router.post('/auth/register', (req, res) => registerController.handle(req, res))
router.post('/auth/login', (req, res) => loginController.handle(req, res))
router.post('/auth/refresh', (req, res) => refreshTokenController.handle(req, res))
router.post('/auth/logout', (req, res) => logoutController.handle(req, res))

// Private routes
const guard = (req: Parameters<typeof auth.handle>[0], res: Parameters<typeof auth.handle>[1], next: Parameters<typeof auth.handle>[2]) =>
    auth.handle(req, res, next)

router.get('/auth/me', guard, (req, res) => meController.handle(req, res))

router.get('/categories', guard, (req, res) => listCategoriesController.handle(req, res))
router.post('/categories', guard, (req, res) => createCategoryController.handle(req, res))

router.post('/transactions', guard, (req, res) => createTransactionController.handle(req, res))
router.get('/transactions', guard, (req, res) => listTransactionsController.handle(req, res))
router.get('/transactions/:id', guard, (req, res) => getTransactionController.handle(req, res))
router.patch('/transactions/:id', guard, (req, res) => updateTransactionController.handle(req, res))
router.delete('/transactions/:id', guard, (req, res) => deleteTransactionController.handle(req, res))

export { router }
