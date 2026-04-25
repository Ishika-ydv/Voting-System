export const isPollActive = (poll) => {
  const now = new Date();

  return (
    poll.startsAt <= now &&
    poll.endsAt > now
  );
};