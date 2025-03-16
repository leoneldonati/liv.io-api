export const getLocationByIp = async (ip: string) => {
  const res = await fetch(`https://ip.guide/${ip}`);
  if (!res.ok) return null;
  return await res.json();
};
