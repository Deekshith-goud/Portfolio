export async function generateVisitorId(): Promise<string> {
  const inputs = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency,
    (navigator as any).deviceMemory,
  ];

  const rawFingerprint = inputs.join('|');
  
  // Hash the fingerprint
  const encoder = new TextEncoder();
  const data = encoder.encode(rawFingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
