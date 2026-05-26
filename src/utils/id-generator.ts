export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function generateElementId(): string {
  const chars = 'abcdef0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
