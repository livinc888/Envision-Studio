/**
 * Shared Overdue Logic Helper (Frontend)
 * A project is overdue when the deadline (YYYY-MM-DD) is strictly before today
 * and the status is not 'Completed'.
 */
export function isProjectOverdue(deadline: string, status: string): boolean {
  if (status === 'Completed') return false;
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  return deadline < today;
}

export function getDaysRemaining(deadline: string): { days: number; isOverdue: boolean; label: string } {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const targetDate = new Date(`${deadline}T00:00:00Z`);
  const todayDate = new Date(`${todayStr}T00:00:00Z`);

  const diffTime = targetDate.getTime() - todayDate.getTime();
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { days, isOverdue: true, label: `${Math.abs(days)}d overdue` };
  }
  if (days === 0) {
    return { days: 0, isOverdue: false, label: 'Due today' };
  }
  return { days, isOverdue: false, label: `${days}d left` };
}
