CREATE OR REPLACE FUNCTION ANALYTICS.PUBLIC.{{ translator_func_name }}(EVENT OBJECT)
RETURNS OBJECT
LANGUAGE JAVASCRIPT
AS
$$
  let emailType = EVENT.body.data[0][1];
  let body = EVENT.body.data[0][2];

  let eventBody = {
    "emailType": emailType,
    "body": body
  };

  return {
    "body": JSON.stringify(eventBody),
    "urlSuffix": "?emailType=" + encodeURIComponent(emailType),
    "translatorData": EVENT.body
  };
$$;