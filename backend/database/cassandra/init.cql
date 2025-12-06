SELECT now() FROM system.local;

CREATE KEYSPACE IF NOT EXISTS catalogs 
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

USE catalogs;

CREATE TABLE IF NOT EXISTS logs (
    day date,
    bucket int,
    timestamp timestamp,
    log_id uuid,
    server_origin text,
    log_type text,
    severity text,
    message text,
    raw_data text,
    metadata map<text, text>,
    masked boolean,
    PRIMARY KEY ((day, bucket), timestamp, log_id)
) WITH CLUSTERING ORDER BY (timestamp DESC);

CREATE TABLE IF NOT EXISTS log_search_index (
    field text,
    value text,
    day date,
    log_id uuid,
    timestamp timestamp,
    PRIMARY KEY ((field, value, day), timestamp, log_id)
);

CREATE TABLE IF NOT EXISTS log_aggregations (
    aggregation_date date,
    aggregation_type text,
    server_origin text,
    log_type text,
    severity text,
    count counter,
    PRIMARY KEY ((aggregation_date, aggregation_type), server_origin, log_type, severity)
);