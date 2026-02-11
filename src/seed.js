import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding MoodType & Categories...");

  // 1. CLEANUP (Hapus data lama)
  await prisma.moodType.deleteMany();
  await prisma.feelingTag.deleteMany();
  await prisma.relaxationContent.deleteMany();

  // 2. SEED MOOD TYPES (Sesuai Gambar: Skala 1-5)
  // Kita simpan dalam variabel untuk referensi ID nanti

  // ID 4: Very Sad (Score 1) - Menampung Depresi, Cemas Parah, Marah Besar
  const moodVerySad = await prisma.moodType.create({
    data: {
      id: 0, // Sesuai urutan di gambar
      moodName: "Very Sad",
      valueScore: 1,
    },
  });

  // ID 5: Sad (Score 2) - Menampung Sedih ringan, Lelah, Kecewa
  const moodSad = await prisma.moodType.create({
    data: {
      id: 1, // Sesuai urutan di gambar
      moodName: "Sad",
      valueScore: 2,
    },
  });

  // ID 1: Normal (Score 3) - Netral
  const moodNormal = await prisma.moodType.create({
    data: {
      id: 2, // Sesuai urutan di gambar
      moodName: "Normal",
      valueScore: 3,
    },
  });

  // ID 2: Happy (Score 4) - Positif ringan
  const moodHappy = await prisma.moodType.create({
    data: {
      id: 3, // Sesuai urutan di gambar
      moodName: "Happy",
      valueScore: 4,
    },
  });

  // ID 3: Very Happy (Score 5) - Positif tinggi
  const moodVeryHappy = await prisma.moodType.create({
    data: {
      id: 4, // Sesuai urutan di gambar
      moodName: "Very Happy",
      valueScore: 5,
    },
  });

  console.log("✅ Mood Types Created (1-5 Scale)");

  await prisma.feelingTag.createMany({
    data: [
      { moodTypeId: moodVerySad.id, tagName: "Depressed" },
      { moodTypeId: moodVerySad.id, tagName: "Hopeless" },
      { moodTypeId: moodVerySad.id, tagName: "Furious" }, // Sangat Marah
      { moodTypeId: moodVerySad.id, tagName: "Panicked" },
      { moodTypeId: moodVerySad.id, tagName: "Empty" }, // Hampa
      { moodTypeId: moodVerySad.id, tagName: "Hurt" },
      { moodTypeId: moodVerySad.id, tagName: "Traumatized" },
    ],
  });

  // --- Tags for SAD (id: 1) ---
  await prisma.feelingTag.createMany({
    data: [
      { moodTypeId: moodSad.id, tagName: "Sad" },
      { moodTypeId: moodSad.id, tagName: "Disappointed" },
      { moodTypeId: moodSad.id, tagName: "Tired" },
      { moodTypeId: moodSad.id, tagName: "Lonely" },
      { moodTypeId: moodSad.id, tagName: "Insecure" },
      { moodTypeId: moodSad.id, tagName: "Anxious" }, // Gelisah
      { moodTypeId: moodSad.id, tagName: "Annoyed" }, // Kesal
      { moodTypeId: moodSad.id, tagName: "Unmotivated" }, // Malas
    ],
  });

  // --- Tags for NORMAL (id: 2) ---
  await prisma.feelingTag.createMany({
    data: [
      { moodTypeId: moodNormal.id, tagName: "Okay" }, // Biasa Saja
      { moodTypeId: moodNormal.id, tagName: "Calm" },
      { moodTypeId: moodNormal.id, tagName: "Focused" },
      { moodTypeId: moodNormal.id, tagName: "Bored" },
      { moodTypeId: moodNormal.id, tagName: "Confused" },
      { moodTypeId: moodNormal.id, tagName: "Sleepy" },
    ],
  });

  // --- Tags for HAPPY (id: 3) ---
  await prisma.feelingTag.createMany({
    data: [
      { moodTypeId: moodHappy.id, tagName: "Happy" },
      { moodTypeId: moodHappy.id, tagName: "Grateful" },
      { moodTypeId: moodHappy.id, tagName: "Relaxed" },
      { moodTypeId: moodHappy.id, tagName: "Optimistic" },
      { moodTypeId: moodHappy.id, tagName: "Relieved" }, // Lega
      { moodTypeId: moodHappy.id, tagName: "Comfortable" }, // Nyaman
    ],
  });

  // --- Tags for VERY HAPPY (id: 4) ---
  await prisma.feelingTag.createMany({
    data: [
      { moodTypeId: moodVeryHappy.id, tagName: "Excited" }, // Bersemangat
      { moodTypeId: moodVeryHappy.id, tagName: "Proud" },
      { moodTypeId: moodVeryHappy.id, tagName: "In Love" },
      { moodTypeId: moodVeryHappy.id, tagName: "Inspired" },
      { moodTypeId: moodVeryHappy.id, tagName: "Satisfied" }, // Puas
      { moodTypeId: moodVeryHappy.id, tagName: "Euphoric" },
    ],
  });

  console.log("✅ Feeling Tags populated successfully.");

  // =======================================================
  // 4. SEED CONTENT TAGS (Label untuk Konten Relaksasi)
  // =======================================================

  // Tag: Meditation (Ungu - Spiritual/Tenang)
  const tagMeditasi = await prisma.contentTag.create({
    data: { tagName: "Meditation", hexColor: "#8E44AD" },
  });

  // Tag: Breathing (Biru Muda - Udara/Segar)
  const tagBreathing = await prisma.contentTag.create({
    data: { tagName: "Breathing", hexColor: "#3498DB" },
  });

  // Tag: Sleep & Rest (Biru Gelap - Malam)
  const tagSleep = await prisma.contentTag.create({
    data: { tagName: "Sleep & Rest", hexColor: "#2C3E50" },
  });

  // Tag: Yoga & Movement (Hijau - Alam/Fisik)
  const tagYoga = await prisma.contentTag.create({
    data: { tagName: "Yoga & Movement", hexColor: "#27AE60" },
  });

  // Tag: Music & Lofi (Kuning/Oranye - Kreatif/Hangat)
  const tagMusic = await prisma.contentTag.create({
    data: { tagName: "Music & Lofi", hexColor: "#F39C12" },
  });

  // Tag: Motivation (Merah - Energi/Semangat)
  const tagMotivation = await prisma.contentTag.create({
    data: { tagName: "Motivation", hexColor: "#E74C3C" },
  });

  // Tag: Education (Teal - Pengetahuan/Kejelasan)
  const tagEducation = await prisma.contentTag.create({
    data: { tagName: "Education", hexColor: "#16A085" },
  });
}

async function moodSeed() {
  const targetUserId = "10297464-3699-4fbc-83f7-522099ea9efa"; // User ID Target

  // const result = await prisma.moodLog.findMany({
  //   where: { userId: targetUserId },
  // });

  // console.log(result);
  console.log(`Creating mood logs for user: ${targetUserId}...`);

  // Helper untuk membuat tanggal mundur (H-1, H-2, dst)
  const getPastDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  // Data Skenario Log (Cerita: Dari Stres -> Membaik -> Bahagia)
  const logScenarios = [
    {
      daysAgo: 6,
      moodId: 0, // Very Sad
      tagName: "Depressed",
      note: "Rasanya berat sekali memulai minggu ini. Banyak tekanan dari tugas akhir.",
    },
    {
      daysAgo: 5,
      moodId: 1, // Sad
      tagName: "Tired",
      note: "Kurang tidur karena begadang, tapi setidaknya ada sedikit progres.",
    },
    {
      daysAgo: 4,
      moodId: 1, // Sad
      tagName: "Anxious",
      note: "Besok ada presentasi, jantung berdebar terus.",
    },
    {
      daysAgo: 3,
      moodId: 2, // Normal
      tagName: "Focused",
      note: "Mencoba fokus mengerjakan revisi. Not bad.",
    },
    {
      daysAgo: 2,
      moodId: 3, // Happy
      tagName: "Relieved",
      note: "Presentasi selesai! Rasanya beban 100kg diangkat dari pundak.",
    },
    {
      daysAgo: 1,
      moodId: 3, // Happy
      tagName: "Relaxed",
      note: "Hari ini santai, main game dan dengar lagu seharian.",
    },
    {
      daysAgo: 0, // Hari Ini
      moodId: 4, // Very Happy
      tagName: "Proud",
      note: "Dapat feedback positif dari dosen pembimbing. Sangat bangga dengan diri sendiri!",
    },
  ];

  // Loop untuk insert data
  for (const log of logScenarios) {
    // 1. Cari ID Feeling Tag berdasarkan nama (Dynamic Lookup)
    const tag = await prisma.feelingTag.findFirst({
      where: {
        tagName: log.tagName,
        moodTypeId: log.moodId,
      },
    });

    if (tag) {
      await prisma.moodLog.create({
        data: {
          userId: targetUserId,
          moodTypeId: log.moodId,
          feelingTagId: tag.id, // Pakai ID yang ditemukan
          logDate: getPastDate(log.daysAgo),
          journalNote: log.note,
          recommendedContentId: null, // Biarkan null dulu untuk seed manual
        },
      });
    }
  }

  console.log("✅ 7 Days of Mood Logs created for user.");
}

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

moodSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// async function getAllMoods() {
//   return await prisma.moodLog.findMany({
//     where: { userId: "1e54f723-2841-4d66-a82c-91af17cdb45f" },
//   });
// }

// getAllMoods()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
