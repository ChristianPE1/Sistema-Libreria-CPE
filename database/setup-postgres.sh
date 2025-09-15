set -e

if [ ! -s "$PGDATA/PG_VERSION" ]; then
    initdb -D "$PGDATA" --auth-local=trust --auth-host=md5
    echo "listen_addresses = '*'" >> "$PGDATA/postgresql.conf"
    echo "port = 5432" >> "$PGDATA/postgresql.conf"
    echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
fi

pg_ctl -D "$PGDATA" start
until pg_isready -h localhost -p 5432 >/dev/null 2>&1; do sleep 1; done

psql -v ON_ERROR_STOP=1 <<-EOSQL >/dev/null 2>&1
    CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD' CREATEDB SUPERUSER;
    CREATE DATABASE $POSTGRES_DB OWNER $POSTGRES_USER;
EOSQL

while true; do sleep 1; done
