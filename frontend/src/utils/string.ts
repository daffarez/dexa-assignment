export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getFirstName = (fullName: string): string => {
  if (!fullName) return "";
  const firstName = fullName.split(" ")[0];
  return capitalize(firstName);
};
