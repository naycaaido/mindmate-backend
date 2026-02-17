import userService from "../services/userService.js";

const getMyProfile = async (req, res) => {
  const userId = req.user;

  const { user, displayStreak } = userService.getMyProfile(userId);

  return res.json({
    data: {
      username: user.username,
      email: user.email,
      currentStreak: {
        length: displayStreak,
        startDate: user.streaks.startDate,
        endDate: user.streaks.endDate,
      },
      photoUrl: user.photo_profile,
    },
  });
};

export default { getMyProfile };
