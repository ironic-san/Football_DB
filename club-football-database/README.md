# Club Football Database

This folder contains the Neo4j database backup (`neo4j.dump`) and the Cypher query documentation used by the Club Football Database project.

## Database Requirements

- Neo4j Desktop

- A Neo4j version compatible with the version used to create the dump

- Approximately 66 MB of disk space for the dump, plus additional space for the restored database

## Restoring the Database

### 1. Download the Project

Clone the repository or download it from GitHub. Locate the `club-football-database` folder.

### 2. Locate the Database Dump

The backup file is:

`club-football-database/neo4j.dump`

### 3. Restore the Dump

1. Open Neo4j Desktop.

2. Create or select a local DBMS compatible with the dump's Neo4j version.

3. Stop the DBMS if it is running.

4. Open a terminal for the DBMS installation, or use the Neo4j command-line tools available in your installation.

5. Restore the dump using the following command, replacing the paths and database name as appropriate:

```
neo4j-admin database load neo4j \  --from-path=/path/to/club-football-database \  --overwrite-destination=true
```

Run this command from an environment where `neo4j-admin` is available. The `--from-path` option points to the directory containing `neo4j.dump`. On Windows, use the corresponding Windows paths and command syntax.

**Important:** The destination database must be stopped before loading. The destination database name in this example is `neo4j`; use the same name in the backend configuration, or change both to match your chosen database name.

If your installed Neo4j version uses a different import or load workflow, follow the official Neo4j documentation for that version.

### 4. Start the Database

Start the DBMS in Neo4j Desktop. Verify that the restored database is running and that its Bolt connection is available.

The usual local Bolt URI is:

`bolt://localhost:7687`

Use the actual URI, username, and password configured for your DBMS.

### 5. Connect the Backend

Configure the backend's `.env` file with the appropriate Neo4j connection details. Refer to `club-football-backend/.env.example` for the required variable names.

Do not commit your `.env` file or database credentials to GitHub.

## Cypher Query Documentation

The file `Club_Football_Cypher_Queries_Q1-Q18_Work_Formatted_v2.md` contains the project's Q1–Q18 Cypher query documentation.

## Notes

- The dump contains a database snapshot from the time it was exported.

- The dump file is a backup, not a live connection to the original database.

- Database contents and query results depend on the snapshot and the Neo4j version used.
