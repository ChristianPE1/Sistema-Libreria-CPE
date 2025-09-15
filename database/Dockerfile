FROM ubuntu:22.04

# Evitar configuracion interactiva
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget ca-certificates gnupg lsb-release locales \
    && rm -rf /var/lib/apt/lists/*

RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8

# Repositorio PostgreSQL
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update && apt-get install -y \
    postgresql-15 postgresql-client-15 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /tmp/postgresql/data \
    && chown -R postgres:postgres /tmp/postgresql \
    && chmod 700 /tmp/postgresql/data


COPY setup-postgres.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/setup-postgres.sh

ENV POSTGRES_DB=libreria_db
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=password123
ENV PGDATA=/tmp/postgresql/data
ENV PATH=/usr/lib/postgresql/15/bin:$PATH

EXPOSE 5432

USER postgres

CMD ["/usr/local/bin/setup-postgres.sh"]
