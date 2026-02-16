import prisma from "../database/prisma.js";
import { calculateMoodStability } from "../utils/moodAnalytics.js";

export const getMoodStability = async (req, res) => {
  try {
    const userId = req.user;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodLogs = await prisma.moodLog.findMany({
      where: {
        userId: userId,
        logDate: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        moodType: true,
      },
      orderBy: {
        logDate: "asc",
      },
    });

    const scoresArray = moodLogs.map((log) => log.moodType.valueScore);

    // --- TAMBAHAN VALIDASI UNTUK HARI BOLONG ---
    const MINIMUM_LOGS_REQUIRED = 4; // Minimal 4 log untuk rentang 7 hari

    if (scoresArray.length < MINIMUM_LOGS_REQUIRED) {
      return res.status(200).json({
        message: "Data kurang untuk dianalisis",
        data: {
          period: "7 Days",
          totalLogs: scoresArray.length,
          isEnoughData: false, // Beritahu Frontend agar menampilkan UI "Data Kurang"
          stabilityScore: null,
          stabilityLabel:
            "Catat mood-mu minimal 4 kali minggu ini untuk melihat analisis stabilitas.",
        },
      });
    }

    // Jika data cukup, lanjut hitung
    const stabilityPercentage = calculateMoodStability(scoresArray);

    let stabilityLabel = "Sangat Fluktuatif";
    if (stabilityPercentage >= 80) stabilityLabel = "Sangat Stabil";
    else if (stabilityPercentage >= 60) stabilityLabel = "Cukup Stabil";
    else if (stabilityPercentage >= 40) stabilityLabel = "Mulai Berubah-ubah";

    return res.status(200).json({
      message: "Berhasil menghitung stabilitas mood",
      data: {
        period: "30 Days",
        totalLogs: scoresArray.length,
        stabilityScore: stabilityPercentage,
        stabilityLabel: stabilityLabel,
      },
    });
  } catch (error) {
    console.error("Error calculating mood stability:", error);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};
