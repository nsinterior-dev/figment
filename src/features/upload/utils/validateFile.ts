// TODO: Implement file validation utility

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024;

type ValidationResult =
{ valid: true} |
{ valid: false, error: string}

export function validateFile(file: File): ValidationResult {
  switch(true){
    case !ALLOWED_FILE_TYPES.includes(file.type):
      return {
        valid: false, 
        error: 'File must be an image (png, jpg, webp)'
      };
    case file.size > MAX_SIZE:
      return {
        valid: false, 
        error: 'File must be under 10MB'
      };
    default:
      return {
        valid: true
      };
  }
}
