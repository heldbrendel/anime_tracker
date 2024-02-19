-- CreateTable
CREATE TABLE "anime" (
    "mal_id" INTEGER NOT NULL,
    "title" VARCHAR NOT NULL,
    "alternate_title" VARCHAR NOT NULL,
    "score" DECIMAL NOT NULL,
    "status" VARCHAR NOT NULL,

    CONSTRAINT "anime_pkey" PRIMARY KEY ("mal_id")
);
