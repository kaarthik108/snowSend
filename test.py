from utils.snow_connect import SnowflakeConnection

class SnowSendTest:
    def __init__(self):
        self.session = SnowflakeConnection().get_session()

    def execute_sql_from_file(self, filename):
        with open(f"utils/{filename}", 'r') as f:
            sql_commands = f.read()

        print(f"The SQL commands are:\n {sql_commands}")
        # self.session.sql(sql_commands).collect()


if __name__ == '__main__':

    executor = SnowSendTest()

    try:
        executor.execute_sql_from_file('request_translator.sql')
        executor.execute_sql_from_file('external_function.sql')
    except Exception as e:
        print(e)
