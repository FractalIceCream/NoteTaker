const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const filename = './db/db.json';

router.get('/notes', (req, res) => {
    const data = fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

router.delete('/notes/:id', (req, res) => {
    const reqId = req.params.id;
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert string into JSON object
            const parsedData = JSON.parse(data);

            const result = parsedData.findIndex(obj => obj.id === reqId);

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

        // Obtain existing reviews
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedData = JSON.parse(data);

                // Add a new review
                parsedData.push(newNote);

                // Write updated reviews back to the file
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

        //   console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

module.exports = router;