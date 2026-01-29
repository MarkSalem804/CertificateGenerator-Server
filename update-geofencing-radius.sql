-- Update all existing events to use 1km (1000m) geofencing radius
-- Run this SQL query in your database client or Prisma Studio

UPDATE event 
SET geofencingRadius = 1000 
WHERE geofencingRadius = 50 OR geofencingRadius < 1000;

-- Verify the update
SELECT id, name, geofencingRadius 
FROM event 
ORDER BY id DESC 
LIMIT 10;

