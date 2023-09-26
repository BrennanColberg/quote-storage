# ingest production DATABASE_URL from .env.prod file (removing quotes)
PROD_DATABASE_URL=$(grep DATABASE_URL .env.prod | cut -d '=' -f2- | tr -d '"')
# ingest local DATABASE_URL from .env file (removing quotes)
LOCAL_DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"')

# dump production database to file
pg_dump "$PROD_DATABASE_URL" > prod-dump.sql
# remove everything from local database
psql "$LOCAL_DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;"
# load dump into local database
psql "$LOCAL_DATABASE_URL" < prod-dump.sql

# cleanup
rm prod-dump.sql