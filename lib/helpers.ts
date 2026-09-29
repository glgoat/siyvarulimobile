export function calculateAge(date: string | null) {
  if (!date) return null;
  const birth = new Date(date);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function formatTime(date: string) {
  return new Intl.DateTimeFormat('ka-GE', { hour: 'numeric', minute: '2-digit' }).format(new Date(date));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('ka-GE', { day: 'numeric', month: 'short' }).format(new Date(date));
}

export function displayIntention(value: string | null) {
  return ({ serious: 'სერიოზული ურთიერთობა', casual: 'მსუბუქი ურთიერთობა', friendship: 'მეგობრობა', not_sure: 'ჯერ არ ვიცი' } as Record<string, string>)[value || ''] || '';
}
