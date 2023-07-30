from jinja2 import Template
from utils.snow_connect import SnowflakeConnection

EXTERNAL_FUNC = "_snowsend"  # The name of the external function
TRANSLATOR_UDF = "_request_translator"


class SnowSendTest:
    def __init__(self):
        self.session = SnowflakeConnection().get_session()

    def execute_sql_from_file(self, filename):
        with open(f"utils/{filename}", "r") as f:
            sql_commands = f.read()

        template = Template(sql_commands)
        sql_commands = template.render(
            func_name=EXTERNAL_FUNC, translator_func_name=TRANSLATOR_UDF
        )

        print(f"The SQL commands to be executed:\n {sql_commands}")
        # self.session.sql(sql_commands).collect()


if __name__ == "__main__":
    executor = SnowSendTest()

    try:
        executor.execute_sql_from_file("request_translator.sql")
        executor.execute_sql_from_file("alter_external_function.sql")
    except Exception as e:
        print(e)
