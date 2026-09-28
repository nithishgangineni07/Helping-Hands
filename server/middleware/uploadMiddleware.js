import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createStorage = (subfolder) => {
  const destDir = path.join(__dirname, `../uploads/${subfolder}`);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
      cb(null, `${uniqueSuffix}_${sanitizedName}`);
    }
  });
};

const fileFilter = (allowedTypes) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: .${ext}. Allowed formats: ${allowedTypes.join(', ')}`), false);
  }
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadLogo = multer({
  storage: createStorage('trust-logos'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter(['jpg', 'jpeg', 'png', 'webp'])
});

export const uploadCampaignImage = multer({
  storage: createStorage('campaign-images'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter(['jpg', 'jpeg', 'png', 'webp'])
});

export const uploadImpactMedia = multer({
  storage: createStorage('impact-media'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter(['jpg', 'jpeg', 'png', 'webp', 'pdf'])
});

export const uploadComplianceDocs = multer({
  storage: createStorage('compliance-docs'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter(['jpg', 'jpeg', 'png', 'pdf'])
});
