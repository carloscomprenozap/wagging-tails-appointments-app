
// A simple utility function to generate pseudo-unique IDs
// This is used instead of the uuid package which is having import issues
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}
