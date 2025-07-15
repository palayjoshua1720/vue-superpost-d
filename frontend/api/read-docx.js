const formidable = require('formidable');
const mammoth = require('mammoth');
const { Configuration, OpenAIApi } = require('openai');

// Disable default body parser for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: 'File upload error' });

        const prompt = fields.prompt;
        const file = files.file;

        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        try {
            // Extract text from the docx file
            const { value: docText } = await mammoth.extractRawText({ path: file.filepath });

            // Compose the AI prompt
            const aiPrompt = `
You are a helpful assistant. The user uploaded a document. Here is the content:

${docText.slice(0, 8000)}

User question: ${prompt}

Answer in detail:
      `.trim();

            // Call OpenAI API
            const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createChatCompletion({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that answers questions about uploaded documents.' },
                    { role: 'user', content: aiPrompt }
                ],
                max_tokens: 800,
            });

            const aiResponse = completion.data.choices[0].message.content;

            res.status(200).json({
                prompt,
                aiResponse,
            });
        } catch (e) {
            res.status(500).json({ error: 'Failed to process docx file.' });
        }
    });
} 