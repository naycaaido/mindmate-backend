import prisma from "../database/prisma.js";
import { calculateMoodStability } from "../utils/moodAnalytics.js";

const getMoodStability = async (userId) => {
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
    return {
      message: "Data kurang untuk dianalisis",
      data: {
        period: "7 Days",
        totalLogs: scoresArray.length,
        isEnoughData: false, // Beritahu Frontend agar menampilkan UI "Data Kurang"
        stabilityScore: null,
        stabilityLabel:
          "Catat mood-mu minimal 4 kali minggu ini untuk melihat analisis stabilitas.",
      },
    };
  }

  // Jika data cukup, lanjut hitung
  const stabilityPercentage = calculateMoodStability(scoresArray);

  let stabilityLabel = "Sangat Fluktuatif";
  if (stabilityPercentage >= 80) stabilityLabel = "Sangat Stabil";
  else if (stabilityPercentage >= 60) stabilityLabel = "Cukup Stabil";
  else if (stabilityPercentage >= 40) stabilityLabel = "Mulai Berubah-ubah";

  return {
    message: "Berhasil menghitung stabilitas mood",
    data: {
      period: "30 Days",
      totalLogs: scoresArray.length,
      isEnoughData: true,
      stabilityScore: stabilityPercentage,
      stabilityLabel: stabilityLabel,
    },
  };
};

const getTopTriggers = async (userId, days) => {
  // Tentukan batas waktu
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);

  // 1. Ambil semua log user beserta relasi ke Tag dan MoodType
  const moodLogs = await prisma.moodLog.findMany({
    where: {
      userId: userId,
      logDate: {
        gte: targetDate,
      },
    },
    include: {
      moodType: true,
      moodLogTags: {
        include: {
          feelingTag: true, // Untuk mendapatkan nama tag
        },
      },
    },
  });

  // 2. Siapkan penampung (Hash Map) untuk menghitung
  const counts = {
    positive: {},
    neutral: {},
    negative: {},
  };

  // 3. Looping data dan kelompokkan
  moodLogs.forEach((log) => {
    const score = log.moodType.valueScore;

    // Tentukan kategori berdasarkan valueScore (1-5)
    let category = "neutral";
    if (score >= 4) category = "positive";
    else if (score <= 2) category = "negative";

    // Hitung frekuensi tag di dalam log tersebut
    log.moodLogTags.forEach((logTag) => {
      const tagName = logTag.feelingTag.tagName;
      counts[category][tagName] = (counts[category][tagName] || 0) + 1;
    });
  });

  // 4. Helper function untuk memformat, mengurutkan, dan mencari persentase
  const formatCategory = (tagObj) => {
    const sortedArray = Object.entries(tagObj)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const maxCount = sortedArray.length > 0 ? sortedArray[0].count : 0;

    // LOGIKA BARU: Data dianggap cukup JIKA nilai tertingginya minimal 2 (sudah ada repetisi)
    const isEnoughData = maxCount >= 2;

    const formattedTags = sortedArray.map((item) => ({
      ...item,
      percentage: Math.round((item.count / maxCount) * 100),
    }));

    return {
      isEnoughData,
      tags: formattedTags,
    };
  };

  // 5. Format hasil akhir
  const result = {
    positive: formatCategory(counts.positive),
    neutral: formatCategory(counts.neutral),
    negative: formatCategory(counts.negative),
  };

  return result;
};

export default { getMoodStability, getTopTriggers };
