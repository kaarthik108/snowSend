from utils.snow_connect import SnowflakeConnection


class SnowSendTest:
    def __init__(self):
        self.session = SnowflakeConnection().get_session()

    def execute_sql(self, sql_command):
        print(f"The SQL command is:\n {sql_command}")
        # self.session.sql(sql_command).collect()


executor = SnowSendTest()

sql_command = """
SELECT snowsend('{
  "emailType": "test",
  "subject": "Welcome to our service!",
  "title": "Hello new user",
  "link": "http://example.com"
}');
"""

try:
    executor.execute_sql(sql_command)
except Exception as e:
    print(e)
