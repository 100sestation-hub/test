export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  // Handle drive.google.com/file/d/ID/view... or drive.google.com/open?id=ID or drive.google.com/uc?id=ID
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=))([^/&?]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?id=${driveMatch[1]}`;
  }
  return url;
}
