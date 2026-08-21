const express = require('express')
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/user/register');
});

router.get('/home', requireAuth, (req,res)=>{
    res.render('home')
})


module.exports = router;