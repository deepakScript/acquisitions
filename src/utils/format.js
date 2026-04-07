export const formatValidationError = (error) => {
    if(!error || !error.issues)  return 'validation failed';
    
    if(Array.isArray(error.issues)) {
        return error.issues.map((issue) => issue.message).join(', ');
    }
    
    return 'validation failed';
};