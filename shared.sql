\echo 'Delete and recreate shared db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE shared;
CREATE DATABASE shared;
\connect shared

\i shared-schema.sql
\i shared-seed.sql
