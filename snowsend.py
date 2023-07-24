import os
import glob
from pydantic import BaseModel
from utils.snow_connect import SnowflakeConnection


class Config(BaseModel):
    aws_iam_role_arn: str = os.environ["AWS_IAM_ROLE_ARN"]
    invoke_url: str = os.environ["INVOKE_URL"]


class SQLExecutor:
    """
    This class is used to execute SQL commands from the sql/ directory.

    """

    def __init__(self, config: Config):
        self.config = config
        self.session = SnowflakeConnection().get_session()
        self.sql_files = glob.glob("sql/*.sql")

    def execute_sql(self):
        for sql_file in self.sql_files:
            with open(sql_file, "r") as file:
                sql_command = file.read()

            sql_command = sql_command.format(
                AWS_IAM_ROLE_ARN=self.config.aws_iam_role_arn,
                INVOKE_URL=self.config.invoke_url,
            )
            print(f"The SQL command is:\n {sql_command}")
            # self.session.sql(sql_command).collect()


if __name__ == "__main__":
    config = Config()
    SQLExecutor(config).execute_sql()
