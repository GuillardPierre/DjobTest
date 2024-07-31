ALTER TABLE rental
ADD CONSTRAINT rental_duration_check
CHECK (
  CASE 
    WHEN return_date > NOW() THEN
      rental_date + INTERVAL '1 week' <= return_date AND return_date <= rental_date + INTERVAL '3 weeks'
    ELSE
      TRUE
  END
);