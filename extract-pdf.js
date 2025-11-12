/**
 * Extract text from PDF using pdf-parse
 */
const fs = require('fs');
const path = require('path');

async function extractPDF() {
  try {
    // Try to use pdf-parse if available
    let pdfParse;
    try {
      pdfParse = require('pdf-parse');
    } catch (e) {
      console.error('pdf-parse not installed. Installing...');
      const { execSync } = require('child_process');
      try {
        execSync('npm install pdf-parse --no-save', { stdio: 'inherit' });
        pdfParse = require('pdf-parse');
      } catch (installError) {
        console.error('Failed to install pdf-parse. Please install manually: npm install pdf-parse');
        process.exit(1);
      }
    }

    const pdfPath = path.join(__dirname, 'UslugarHR_Transkript_DOSLOVNO.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.error(`PDF file not found: ${pdfPath}`);
      process.exit(1);
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    
    // Write extracted text to file
    const outputPath = path.join(__dirname, 'pdf-extracted-text.txt');
    fs.writeFileSync(outputPath, data.text, 'utf8');
    
    console.log(`Extracted ${data.numpages} pages`);
    console.log(`Text written to: ${outputPath}`);
    console.log('\n--- First 1000 characters ---');
    console.log(data.text.substring(0, 1000));
    
  } catch (error) {
    console.error('Error extracting PDF:', error.message);
    process.exit(1);
  }
}

extractPDF();

