const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const fileName = './db/db.json';


router.get('/notes', (req, res) => {
    const data = fs.readFileSync(fileName, 'utf8');
    console.log(data);
    res.json('Success');
});

router.post('/notes', (req, res) => {
    res.json('Success ');
})
router.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));    
});


module.exports = router;