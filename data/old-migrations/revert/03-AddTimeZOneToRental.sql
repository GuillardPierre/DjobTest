-- Revenir à l'état d'origine avec le type TIMESTAMP sans fuseau horaire
ALTER TABLE rental
    ALTER COLUMN rental_date TYPE TIMESTAMP USING rental_date AT TIME ZONE 'UTC',
    ALTER COLUMN return_date TYPE TIMESTAMP USING return_date AT TIME ZONE 'UTC';
