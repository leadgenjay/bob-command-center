// Schedule utilities for StartCalendarInterval plist format

type SCA = {
  Hour?: number;
  Minute?: number;
  Weekday?: number;
} | Array<{ Hour?: number; Minute?: number; Weekday?: number }>;

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatHourMinute(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${pad(minute)} ${ampm}`;
}

export function formatSchedule(sca: SCA | null | undefined): string {
  if (!sca) return 'Manual';

  if (Array.isArray(sca)) {
    if (sca.length === 0) return 'Custom schedule';

    // Check if it's a set of times (same structure, varying hours)
    const allHaveHour = sca.every(s => s.Hour !== undefined);
    if (allHaveHour) {
      const times = sca.map(s => formatHourMinute(s.Hour!, s.Minute ?? 0));
      if (times.length <= 3) return times.join(', ');
      return `${times.length}x daily`;
    }

    // Hourly-ish repeats
    return `Every ${sca.length} intervals`;
  }

  const { Hour, Minute = 0, Weekday } = sca;

  if (Hour === undefined) {
    // Runs every hour at :MM
    return `Every hour at :${pad(Minute)}`;
  }

  const timeStr = formatHourMinute(Hour, Minute);
  if (Weekday !== undefined) {
    return `${timeStr} weekdays`;
  }
  return `${timeStr} daily`;
}

export function nextRun(sca: SCA | null | undefined): Date | null {
  if (!sca) return null;

  const now = new Date();

  if (Array.isArray(sca)) {
    if (sca.length === 0) return null;

    // Find next scheduled time from array
    const candidates: Date[] = [];
    for (const interval of sca) {
      const candidate = nextRunSingle(interval, now);
      if (candidate) candidates.push(candidate);
    }
    if (candidates.length === 0) return null;
    return candidates.reduce((a, b) => (a < b ? a : b));
  }

  return nextRunSingle(sca, now);
}

function nextRunSingle(
  sca: { Hour?: number; Minute?: number; Weekday?: number },
  now: Date
): Date | null {
  const { Hour, Minute = 0, Weekday } = sca;

  if (Hour === undefined) {
    // Runs every hour at :Minute
    const next = new Date(now);
    next.setSeconds(0, 0);
    if (now.getMinutes() < Minute || (now.getMinutes() === Minute && now.getSeconds() === 0)) {
      next.setMinutes(Minute);
    } else {
      next.setHours(next.getHours() + 1);
      next.setMinutes(Minute);
    }
    return next;
  }

  // Find next occurrence of Hour:Minute, optionally filtered by Weekday
  const next = new Date(now);
  next.setSeconds(0, 0);
  next.setHours(Hour, Minute);

  // If this time today has passed, move to tomorrow
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  if (Weekday !== undefined) {
    // 0=Sunday, 1=Monday, ..., 6=Saturday
    let daysToAdd = 0;
    const targetDay = Weekday;
    while (true) {
      const candidate = new Date(next);
      candidate.setDate(next.getDate() + daysToAdd);
      if (candidate.getDay() === targetDay) {
        return candidate;
      }
      daysToAdd++;
      if (daysToAdd > 7) break;
    }
    return null;
  }

  return next;
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return 'Never';
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString();
}

export function formatDuration(ms: number | null | undefined): string {
  if (!ms) return '';
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${remSec}s`;
}
