
export function logColor(text: string, color: string = 'lime') {
  console.log(`%c${text}`, `color: ${color}`);
}