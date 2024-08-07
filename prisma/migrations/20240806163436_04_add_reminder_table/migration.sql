-- AlterTable
ALTER TABLE "rental" ALTER COLUMN "rental_date" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "return_date" SET DATA TYPE TIMESTAMP(6);

-- CreateTable
CREATE TABLE "reminder" (
    "reminder_id" SERIAL NOT NULL,
    "rental_id" INTEGER NOT NULL,
    "notification_date" TIMESTAMPTZ NOT NULL,
    "notification_sended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reminder_pkey" PRIMARY KEY ("reminder_id")
);

-- CreateIndex
CREATE INDEX "idx_fk_rental_id" ON "reminder"("rental_id");

-- AddForeignKey
ALTER TABLE "reminder" ADD CONSTRAINT "reminder_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rental"("rental_id") ON DELETE RESTRICT ON UPDATE CASCADE;
