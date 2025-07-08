export const EDITOR_CONFIG = {
  DEFAULT_LANGUAGE: "javascript",
  DEFAULT_CONTENT: "// Type your code here...",
  EDITOR_HEIGHT: 600,
} as const;

export const TOAST_MESSAGES = {
  COPY_SUCCESS: "Code copied to clipboard!",
  SAVE_SUCCESS: "Code saved successfully!",
  SAVE_ERROR: "Failed to save your code. Please try again.",
  SIGN_IN_REQUIRED: "Please sign in to save your code.",
  DELETE_SUCCESS: "Paste deleted successfully!",
  DELETE_ERROR: "Failed to delete paste. Please try again.",
  SHARE_SUCCESS: "Share link copied to clipboard!",
} as const;
