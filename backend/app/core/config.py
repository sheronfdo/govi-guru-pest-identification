from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Govi Guru API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"

    # Security
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expires_minutes: int = 60 * 24

    # Default admin bootstrap
    default_admin_email: str = "admin@goviguru.lk"
    default_admin_password: str = "admin123"

    # Database
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "goviguru"
    mysql_password: str = "goviguru"
    mysql_db: str = "goviguru"

    @property
    def sqlalchemy_database_uri(self) -> str:
        return (
            f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_db}"
        )


settings = Settings()
