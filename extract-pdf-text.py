#!/usr/bin/env python3
"""
Extract text from PDF file
"""
import sys
import os

try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False

def extract_with_pypdf2(pdf_path):
    """Extract text using PyPDF2"""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += f"\n--- Page {page_num + 1} ---\n"
            text += page.extract_text()
    return text

def extract_with_pdfplumber(pdf_path):
    """Extract text using pdfplumber (better quality)"""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages):
            text += f"\n--- Page {page_num + 1} ---\n"
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text

def main():
    pdf_path = "UslugarHR_Transkript_DOSLOVNO.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file '{pdf_path}' not found", file=sys.stderr)
        sys.exit(1)
    
    if HAS_PDFPLUMBER:
        print("Using pdfplumber...", file=sys.stderr)
        text = extract_with_pdfplumber(pdf_path)
    elif HAS_PYPDF2:
        print("Using PyPDF2...", file=sys.stderr)
        text = extract_with_pypdf2(pdf_path)
    else:
        print("Error: No PDF library found. Install with: pip install pdfplumber", file=sys.stderr)
        sys.exit(1)
    
    print(text)

if __name__ == "__main__":
    main()

