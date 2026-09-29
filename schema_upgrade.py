from sqlalchemy import inspect, text


def upgrade_schema(engine):
    additions = {
        "workflow_stages": {"conditions": "TEXT", "deadline_days": "INTEGER"},
        "partnership_comments": {"stage_id": "INTEGER"},
        "attachments": {"stage_id": "INTEGER", "file_size": "INTEGER", "document_type": "VARCHAR(50)"},
        "partnerships": {"transfer_status": "VARCHAR(100)"},
    }
    with engine.begin() as connection:
        if connection.dialect.name == "postgresql":
            connection.execute(text("SELECT pg_advisory_xact_lock(72620260929)"))
        inspector = inspect(connection)
        tables = set(inspector.get_table_names())
        for table, fields in additions.items():
            if table not in tables:
                continue
            existing = {c["name"] for c in inspector.get_columns(table)}
            for column, sql_type in fields.items():
                if column not in existing:
                    connection.execute(text(f'ALTER TABLE "{table}" ADD COLUMN "{column}" {sql_type}'))

        for table in ("attachments", "partnership_comments"):
            if table in tables:
                connection.execute(text(f'UPDATE "{table}" SET stage_id = (SELECT stage_id FROM partnerships WHERE partnerships.id = "{table}".partnership_id) WHERE stage_id IS NULL'))
