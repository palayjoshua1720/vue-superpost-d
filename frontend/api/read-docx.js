const formidable = require('formidable');
const mammoth = require('mammoth');

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

            // Here you could call your AI model with docText and prompt
            // For now, just return the extracted text and prompt
            res.status(200).json({
            prompt,
            docText: docText.slice(0, 5000), // limit for demo
            // aiResponse: ...
            });
        } catch (e) {
            res.status(500).json({ error: 'Failed to process docx file.' });
        }
    });
} 