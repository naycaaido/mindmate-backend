import analyticsService from "../services/analyticsService.js";

const getMoodStability = async (req, res, next) => {
  try {
    const userId = req.user;

    const result = await analyticsService.getMoodStability(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getTopTriggers = async (req, res) => {
  try {
    const userId = req.user;
    const days = parseInt(req.query.days) || 30;

    const result = await analyticsService.getTopTriggers(userId, days);

    return res.status(200).json({
      message: "Berhasil mengambil data pemicu emosi",
      data: result,
    });
  } catch (error) {
    console.error("Error getTopTriggers:", error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

export default { getMoodStability, getTopTriggers };
