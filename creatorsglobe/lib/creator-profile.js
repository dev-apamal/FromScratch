import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/prisma";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "portfolio");

function normalizeTitle(filename) {
  const extension = path.extname(filename);
  const baseName = path.basename(filename, extension);

  return baseName.replace(/[-_]+/g, " ").trim() || "Portfolio image";
}

async function savePortfolioFiles(files) {
  await mkdir(uploadDirectory, { recursive: true });

  return Promise.all(
    files.map(async (file, index) => {
      const extension = path.extname(file.name) || ".jpg";
      const filename = `${randomUUID()}${extension}`;
      const destination = path.join(uploadDirectory, filename);
      const bytes = await file.arrayBuffer();

      await writeFile(destination, Buffer.from(bytes));

      return {
        title: normalizeTitle(file.name),
        mediaUrl: `/uploads/portfolio/${filename}`,
        sortOrder: index,
      };
    })
  );
}

export async function createCreatorProfile({ userId, values, portfolioFiles }) {
  const existingProfile = await prisma.creatorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (existingProfile) {
    return existingProfile;
  }

  const portfolioItems = await savePortfolioFiles(portfolioFiles);

  return prisma.creatorProfile.create({
    data: {
      userId,
      headline: values.headline || null,
      bio: values.bio,
      city: values.city,
      latitude: values.latitude,
      longitude: values.longitude,
      experienceLevel: values.experienceLevel,
      availabilityStatus: values.availabilityStatus,
      isAvailableForHire: values.availabilityStatus === "AVAILABLE",
      budgetMin: values.budgetMin,
      budgetMax: values.budgetMax,
      roles: {
        create: values.roles.map((role) => ({
          role,
        })),
      },
      portfolioItems: {
        create: portfolioItems,
      },
    },
    select: {
      id: true,
    },
  });
}
