export function calculateStartDate(range: string): Date | null {
    const now = new Date();
    switch (range) {
      case 'lastWeek':
        return new Date(now.setDate(now.getDate() - 7));
      case 'lastMonth':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'lastThreeMonths':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'lastYear':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
}