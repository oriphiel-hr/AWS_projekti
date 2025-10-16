import { Router } from 'express';
import { uploadMultiple, uploadSingle, deleteFile, getFileUrl } from '../lib/upload.js';
import { auth } from '../lib/auth.js';

const r = Router();

// Upload više slika
r.post('/multiple', auth(true), uploadMultiple, (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nema datoteka za upload' });
    }

    const fileUrls = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: getFileUrl(file.filename),
      size: file.size
    }));

    res.json({
      success: true,
      files: fileUrls,
      message: `Uspješno uploadano ${req.files.length} datoteka`
    });
  } catch (error) {
    next(error);
  }
});

// Upload jedne slike
r.post('/single', auth(true), uploadSingle, (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nema datoteke za upload' });
    }

    const fileData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: getFileUrl(req.file.filename),
      size: req.file.size
    };

    res.json({
      success: true,
      file: fileData,
      message: 'Uspješno uploadana datoteka'
    });
  } catch (error) {
    next(error);
  }
});

// Brisanje datoteke
r.delete('/:filename', auth(true), (req, res, next) => {
  try {
    const { filename } = req.params;
    const deleted = deleteFile(filename);
    
    if (deleted) {
      res.json({ success: true, message: 'Datoteka uspješno obrisana' });
    } else {
      res.status(404).json({ error: 'Datoteka nije pronađena' });
    }
  } catch (error) {
    next(error);
  }
});

export default r;
