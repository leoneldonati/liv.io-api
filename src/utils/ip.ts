export const getLocationByIp = async (ip: string) => {
  const res = await fetch(
    `https://ip.guide/${"2803:9800:98cf:17b6:65eb:d8b9:4c61:55ac"}`
  );
  if (!res.ok) return null;
  return await res.json();
};
