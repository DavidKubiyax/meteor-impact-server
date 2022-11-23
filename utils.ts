
const uuids = new Set<string>();
export function generatrUUID(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  result += chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i=0; i<4; i++) {
    result += Math.floor(Math.random() * 10);
  }
  if (uuids.has(result)) {
    return generatrUUID();
  } else {
    uuids.add(result);
    return result;
  }
}