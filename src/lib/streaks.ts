// calculateCurrentStreak(completions: string[], today?: string): number
export function calculateCurrentStreak(completions: string[], today?: string): number {
	if (!completions || completions.length === 0) return 0;
	// Remove duplicates and sort
	const unique = Array.from(new Set(completions)).sort();
	const now = today || new Date().toISOString().slice(0, 10);
	if (!unique.includes(now)) return 0;

	let streak = 0;
	let current = now;
	const set = new Set(unique);
	while (set.has(current)) {
		streak++;
		const d = new Date(current);
		d.setDate(d.getDate() - 1);
		current = d.toISOString().slice(0, 10);
	}
	return streak;
}
