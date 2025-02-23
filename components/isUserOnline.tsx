export default function isUserOnline(availability: string | null, availability_exp: string | null): boolean {
  "use strict"
  console.log(availability, availability_exp);
  if (availability === null || availability_exp === null) return false;
  const now = new Date();
  const availability_date = new Date(availability);
  const availability_exp_date = new Date(availability_exp);
  return availability_date <= now && now <= availability_exp_date;
}

