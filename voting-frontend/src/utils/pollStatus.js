export function getPollStatus(startsAt, endsAt) {
  const now = new Date();
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (now < start) return "UPCOMING";
  if (now >= start && now <= end) return "ACTIVE";
  return "ENDED";
}