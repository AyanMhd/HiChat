export const DEFAULT_AVATARS = {
  male: "/avatars/male.svg",
  female: "/avatars/female.svg",
};

export const normalizeGender = (gender) => {
  if (gender === "male" || gender === "female") return gender;
  return "male";
};

export const getDefaultAvatar = (gender) => DEFAULT_AVATARS[normalizeGender(gender)];

export const serializeUser = (user) => {
  const source = typeof user.toObject === "function" ? user.toObject() : user;
  return {
    ...source,
    profilePic: source.profilePic || getDefaultAvatar(source.gender),
  };
};
