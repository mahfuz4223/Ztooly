// Valid tool IDs that exist in our project
export const EXISTING_TOOLS = {
  // QR & Barcode Tools
  "qr-generator": "QR Code Generator",
  "barcode-generator": "Barcode Generator",

  // Image Tools  
  "background-remover": "Background Remover",
  "image-resizer": "Image Resizer", 
  "image-exif-remover": "EXIF Remover",
  "image-watermarker": "Image Watermarker",

  // Document Tools
  "pdf-compress": "PDF Compress",
  "pdf-merge": "PDF Merge", 
  "pdf-to-image": "PDF to Image",
  "pdf-to-word": "PDF to Word",
  "pdf-password": "PDF Password",
  "csv-to-json-converter": "CSV to JSON",
  "markdown-previewer": "Markdown Previewer",

  // Security & Dev Tools
  "password-generator": "Password Generator",
  "json-tools": "JSON Tools",
  "url-scanner": "URL Scanner",

  // Calculators
  "percentage-calculator": "Percentage Calculator", 
  "loan-repayment-calculator": "Loan Calculator",
  "bmi-calculator": "BMI Calculator",

  // Generators
  "color-palette-generator": "Color Palette Generator",
  "privacy-policy-generator": "Privacy Policy Generator", 
  "terms-conditions-generator": "Terms Generator",
  "lorem-ipsum-generator": "Lorem Ipsum Generator",
  "hashtag-generator": "Hashtag Generator",

  // Converters
  "case-converter": "Case Converter",
  "reading-time-estimator": "Reading Time Estimator",
  "code-snippet-to-image": "Code to Image",
  "tweet-to-image-converter": "Tweet to Image",

  // Fake Data
  "fake-iban-generator": "Fake IBAN Generator", 
  "fake-credit-card-generator": "Fake Credit Card",
  "fake-address-generator": "Fake Address Generator",
  "fake-tweet-generator": "Fake Tweet Generator",
  "fake-facebook-post-generator": "Fake Facebook Post",
  "random-user-profile-generator": "Random User Profile",

  // AI Content
  "ai-headline-generator": "AI Headline Generator",
  "ai-image-caption-generator": "AI Image Caption",
  "youtube-title-generator": "YouTube Title Generator", 
  "social-media-bio-generator": "Social Media Bio",
  "video-script-hook-generator": "Video Script Hook",

  // Social Media & YouTube
  "youtube-thumbnail-grabber": "YouTube Thumbnail",
  "instagram-profile-viewer": "Instagram Profile Viewer", 
  "youtube-tag-extractor": "YouTube Tag Extractor"
};

// Get tool name by ID
export const getToolName = (toolId: string): string => {
  return EXISTING_TOOLS[toolId as keyof typeof EXISTING_TOOLS] || toolId;
};

// Check if tool exists
export const isValidTool = (toolId: string): boolean => {
  return toolId in EXISTING_TOOLS;
};

// Get all valid tool IDs
export const getValidToolIds = (): string[] => {
  return Object.keys(EXISTING_TOOLS);
};
