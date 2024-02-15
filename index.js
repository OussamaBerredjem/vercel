const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

// Define your GitHub credentials
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'OussamaBerredjem';
const REPO_NAME = 'api_upload_java';

const router = express.Router();

app.use(express.static('public'));

app.use(`/`, router);

app.get('/commit', async (req, res) => {
    try {
        const { default: fetch } = await import('node-fetch'); // Use dynamic import()

        // Step 1: Commit the file to GitHub using GitHub API
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/example.txt`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${GITHUB_TOKEN}`
            },
            body: JSON.stringify({
                message: 'Add example.txt via API',
                content: Buffer.from('This is an example text file content.').toString('base64')
            })
        });

        // Step 2: Check if the file was committed successfully
        if (response.status === 201) {
            console.log('File committed successfully!');
            res.send('File committed successfully!');
        } else {
            const responseData = await response.json();
            console.error('Error committing file:', responseData);
            res.status(response.status).send(responseData);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/", (req, res) => {
    res.json({
        hello: "hi!"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
