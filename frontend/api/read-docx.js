const formidable = require('formidable');
const mammoth = require('mammoth');
const fs = require('fs');
const xlsx = require('xlsx');

// Enable CORS and disable default body parser for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if API key is available
    if (!process.env.OPENROUTER_API_KEY) {
        console.error('OPENROUTER_API_KEY is not set');
        return res.status(500).json({ 
            error: 'API key not configured',
            message: 'OPENROUTER_API_KEY environment variable is not set'
        });
    }

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'File upload error' });

        const prompt = fields.prompt;
        const file = files.file;

        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        // Detect file type by extension
        const fileName = file.originalFilename || file.newFilename || file.filepath;
        const ext = fileName.split('.').pop().toLowerCase();

        let docText = '';
        try {
            if (ext === 'docx') {
                // Extract text from docx
                const result = await mammoth.extractRawText({ path: file.filepath });
                docText = result.value;
            } else if (ext === 'txt' || ext === 'csv') {
                // Read as plain text
                docText = fs.readFileSync(file.filepath, 'utf8');
            } else if (ext === 'xls' || ext === 'xlsx') {
                // Read Excel file and convert to CSV string
                const workbook = xlsx.readFile(file.filepath);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                docText = xlsx.utils.sheet_to_csv(sheet);
            } else {
                return res.status(400).json({ error: 'Unsupported file type' });
            }

            // Compose the AI prompt
            const aiPrompt = `
                You are a helpful assistant. The user uploaded a document. Here is the content:

                ${docText.slice(0, 8000)}

                User question: ${prompt}

                Answer in detail:
            `.trim();

            // Prepare OpenRouter API request body
            const body = {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that answers questions about uploaded documents.' },
                    { role: 'user', content: aiPrompt }
                ],
                max_tokens: 800,
            };

            // Call OpenRouter API
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            // If OpenRouter returns an error, pass it through
            if (!response.ok) {
                console.error('OpenRouter API Error:', data);
                return res.status(response.status).json(data);
            }

            // Extract AI response (OpenRouter format)
            const aiResponse = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                ? data.choices[0].message.content
                : null;

            res.status(200).json({
                prompt,
                aiResponse,
            });
        } catch (e) {
            res.status(500).json({ error: 'Failed to process file.' });
        }
    });
} 