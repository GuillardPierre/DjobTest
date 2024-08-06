-- This is an empty migration.ALTER TABLE "customer"
ALTER TABLE "customer"
ADD COLUMN "timezone" VARCHAR(255) DEFAULT 'Europe/Paris';

ALTER TABLE rental
    ALTER COLUMN rental_date TYPE TIMESTAMPTZ USING rental_date::TIMESTAMPTZ,
    ALTER COLUMN return_date TYPE TIMESTAMPTZ USING return_date::TIMESTAMPTZ;