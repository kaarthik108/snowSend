import os

from snowflake.snowpark.session import Session
from snowflake.snowpark.version import VERSION
from typing import Any, Dict


class SnowflakeConnection:
    """
    This class is used to establish a connection to Snowflake.

    Attributes
    ----------
    connection_parameters : Dict[str, Any]
        A dictionary containing the connection parameters for Snowflake.
    session : snowflake.snowpark.Session
        A Snowflake session object.

    Methods
    -------
    get_session()
        Establishes and returns the Snowflake connection session.

    """

    def __init__(self):
        self.connection_parameters = self._get_connection_parameters_from_env()
        self.session = None

    @staticmethod
    def _get_connection_parameters_from_env() -> Dict[str, Any]:
        connection_parameters = {
            "account": os.environ["ACCOUNT"],
            "user": os.environ["USER_NAME"],
            "password": os.environ["PASSWORD"],
            "warehouse": os.environ["WAREHOUSE"],
            "database": os.environ["DATABASE"],
            "schema": os.environ["SCHEMA"],
            "role": os.environ["ROLE"],
        }
        return connection_parameters

    def get_session(self):
        """
        Establishes and returns the Snowflake connection session.
        Returns:
            session: Snowflake connection session.
        """
        if self.session is None:
            self.session = Session.builder.configs(self.connection_parameters).create()
            self.session.sql_simplifier_enabled = True
        return self.session
