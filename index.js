/* eslint-disable no-undef */
const express = require('express');
const fs = require('fs');
const app = express();

const port = 8080;

// Define your GitHub credentials
const GITHUB_TOKEN = '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';
const REPO_OWNER = 'OussamaBerredjem';
const REPO_NAME = 'api_upload_java';

const router = express.Router();

// Define the file content and path
const filePath = 'example.txt';
const fileContent = 'This is an example text file content.';

app.use(express.static('public'));

app.use(`/`, router);



router.get('/commit', async (req, res) => {
    try {
        const { default: fetch } = await import('node-fetch'); // Use dynamic import()
        // Step 1: Create a new file on the local file system
        fs.writeFileSync(filePath, fileContent);

        // Step 2: Commit the file to GitHub using GitHub API
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${GITHUB_TOKEN}`
            },
            body: JSON.stringify({
                message: 'Add example.txt via API',
                content: Buffer.from(fileContent).toString('base64')
            })
        });

        // Step 3: Check if the file was committed successfully
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

router.get("/hy", (req, res) => {
    res.json({
      hello: "hi!"
    });
  });


app.listen(port||process.env.PORT,()=>{
  console.log(port)
});
