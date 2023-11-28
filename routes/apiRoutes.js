const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const filename = './db/db.json';

//GET route for /api/notes read db.json
router.get('/notes', (req, res) => {
    const data = fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

//DELETE route for /api/notes based off uuid
router.delete('/notes/:id', (req, res) => {
    //retrieve id from data-note attr
    const reqId = req.params.id;
    //read db.json
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert string into JSON object
            const parsedData = JSON.parse(data);
            //seek index for obj with reqId return -1 if doesn't exist
            const result = parsedData.findIndex(obj => obj.id === reqId);
            //remove note with splice and write new saved notes to file
            if (result != -1) {
                parsedData.splice(result, 1);
                console.log(parsedData);
                fs.writeFile(
                    filename,
                    JSON.stringify(parsedData, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully deleted note!')
                );
            }
        }
    });
    res.json("no match found!");
});

//POST route for /api/notes create new note with title, text, uuid
router.post('/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        // Obtain saved notes
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedData = JSON.parse(data);

                // Add a new note
                parsedData.push(newNote);

                // Write saved notes back to the file
                fs.writeFile(
                    filename,
                    JSON.stringify(parsedData, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

module.exports = router;