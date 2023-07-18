const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, loginUser } = require('../controllers/users');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');
const NotFound = require('../errors/NotFound');

router.post('/signin', validateLogin, loginUser);
router.post('/signup', validateCreateUser, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => {
  next(new NotFound('Такой страницы не существует.'));
});

module.exports = router;
