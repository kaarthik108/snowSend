CREATE OR REPLACE EXTERNAL FUNCTION snowsend(msg string)
    RETURNS variant
    API_INTEGRATION = snowsend_api_gateway
    MAX_BATCH_ROWS=1
    AS 
    '{INVOKE_URL}';