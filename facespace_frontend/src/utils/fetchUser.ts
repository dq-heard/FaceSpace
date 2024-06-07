export const fetchUser = (): { googleID: string } | null => {
  const userItem = localStorage.getItem("user");

  if (userItem !== null) {
    try {
      const userInfo = JSON.parse(userItem);
      if (
        typeof userInfo === "object" &&
        typeof userInfo.googleID === "string"
      ) {
        return userInfo;
      }
    } catch (error) {
      console.error("Error parsing user information:", error);
    }
  }

  return null;
};
