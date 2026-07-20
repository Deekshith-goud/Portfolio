export async function generateVisitorId(): Promise<string> {
  // Generate a completely random string for this specific browser profile
  const rawFingerprint = crypto.randomUUID();
  
  // Hash it to a 64-character hex string to match the API's strict validation
  const encoder = new TextEncoder();
  const data = encoder.encode(rawFingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
