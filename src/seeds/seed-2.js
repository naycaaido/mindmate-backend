import prisma from "../database/prisma.js"

const MOOD_TYPES = [
  { id: 1, moodName: "Very Sad", valueScore: 1 },
  { id: 2, moodName: "Sad", valueScore: 2 },
  { id: 3, moodName: "Normal", valueScore: 3 },
  { id: 4, moodName: "Happy", valueScore: 4 },
  { id: 5, moodName: "Very Happy", valueScore: 5 },
];

const FEELING_TAGS = {
  1: ["Devastated", "Hopeless", "Very Lonely", "Grieving", "Hurting"],
  2: [
    "Overthinking",
    "Assignments",
    "Finances",
    "Lack of Sleep",
    "Exhausted",
    "Disappointed",
  ],
  3: ["Routine", "Busy", "Bored", "Peaceful", "Nothing Special"],
  4: ["Productive", "Hanging Out", "Good Food", "Working Out", "Relaxing"],
  5: ["Grateful", "Achievement", "Energetic", "Vacation", "In Love"],
};

async function main() {
  console.log("Memulai proses seed MoodType dan FeelingTag...");

  // 1. Seed MoodType
  for (const mood of MOOD_TYPES) {
    await prisma.moodType.upsert({
      where: { id: mood.id },
      update: {
        moodName: mood.moodName,
        valueScore: mood.valueScore,
      },
      create: {
        id: mood.id,
        moodName: mood.moodName,
        valueScore: mood.valueScore,
      },
    });
    console.log(`Upserted MoodType: ${mood.moodName}`);
  }

  // 2. Seed FeelingTag
  // Hapus data tag lama agar tidak ada duplikasi berlapis saat script dijalankan ulang
  await prisma.feelingTag.deleteMany({});
  console.log("Data FeelingTag lama dibersihkan.");

  let tagCount = 0;
  for (const [moodId, tags] of Object.entries(FEELING_TAGS)) {
    const tagData = tags.map((tagName) => ({
      moodTypeId: parseInt(moodId),
      tagName: tagName,
    }));

    await prisma.feelingTag.createMany({
      data: tagData,
    });
    tagCount += tags.length;
  }

  console.log(`Berhasil insert ${tagCount} FeelingTag.`);
  console.log("Proses seed selesai.");
}

main()
  .catch((e) => {
    console.error("Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
