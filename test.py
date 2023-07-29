from utils.snow_connect import SnowflakeConnection

req_translator = """
CREATE OR REPLACE FUNCTION ANALYTICS.PUBLIC._req_translator(EVENT OBJECT)
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
"""

sql_command = """

ALTER function ANALYTICS.PUBLIC."__snowsend-36f777c"(string, variant)
 set REQUEST_TRANSLATOR = analytics.public._req_translator;

SELECT ANALYTICS.PUBLIC."__snowsend-36f777c"('test',PARSE_JSON('{"subject": "Welcome to our service!"}'));

"""


class SnowSendTest:
    def __init__(self):
        self.session = SnowflakeConnection().get_session()

    def execute_sql(self, sql_command):
        print(f"The SQL command is:\n {sql_command}")
        self.session.sql(req_translator).collect()
        self.session.sql(sql_command).collect()


executor = SnowSendTest()


try:
    executor.execute_sql(sql_command)
except Exception as e:
    print(e)