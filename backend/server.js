const express = require('express');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const app = express();
const port = process.env.PORT || 3000;
const lambdaClient = new LambdaClient({ region: 'us-west-2' });
const path = require('path');

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));



app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route to trigger Lambda function
app.get('/security-assessment', async (req, res) => {
  try {

    const result = await lambdaClient.send(new InvokeCommand({
      FunctionName: 'SecurityAssessmentFunction',
      Payload: JSON.stringify({}), // Pass any necessary parameters here
    }));

    // Parse and send response
    const response = JSON.parse(Buffer.from(result.Payload).toString('utf8'));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
