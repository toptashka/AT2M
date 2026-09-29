import os

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError

security = HTTPBearer(auto_error=False)
ROLES = {"Пользователь", "Руководитель", "Администратор"}


class Principal(str):
    def __new__(cls, username, roles, subject="", display_name=""):
        obj = str.__new__(cls, username)
        obj.roles = set(roles)
        obj.subject = subject
        obj.display_name = display_name or username
        return obj

    @property
    def manager(self):
        return bool(self.roles & {"Руководитель", "Администратор"})

    @property
    def admin(self):
        return "Администратор" in self.roles


def authenticate(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(401, "Требуется вход в систему", headers={"WWW-Authenticate": "Bearer"})
    raw_key = os.getenv("KC_PUBLIC_KEY", "").strip()
    if not raw_key:
        raise HTTPException(503, "Не настроен KC_PUBLIC_KEY. Проверка токенов обязательна.")
    key = raw_key if "BEGIN PUBLIC KEY" in raw_key else f"-----BEGIN PUBLIC KEY-----\n{raw_key}\n-----END PUBLIC KEY-----"
    audience = os.getenv("KC_AUDIENCE") or None
    issuer = os.getenv("KC_ISSUER") or None
    client_id = os.getenv("KC_CLIENT_ID", "frontend-app")
    try:
        claims = jwt.decode(
            credentials.credentials, key, algorithms=["RS256"], audience=audience, issuer=issuer,
            options={"require_exp": True, "require_sub": True, "verify_aud": bool(audience), "verify_iss": bool(issuer)}
        )
        if claims.get("azp") != client_id:
            raise JWTError("Wrong client")
        username = claims.get("preferred_username")
        if not isinstance(username, str) or not username.strip():
            raise JWTError("Missing username")
        roles = set(claims.get("realm_access", {}).get("roles", []))
        roles.update(claims.get("resource_access", {}).get(client_id, {}).get("roles", []))
    except (JWTError, ValueError, TypeError, AttributeError):
        raise HTTPException(401, "Токен недействителен или истёк", headers={"WWW-Authenticate": "Bearer"})
    roles &= ROLES
    if not roles:
        raise HTTPException(403, "В Keycloak не назначена роль приложения")
    return Principal(username.strip(), roles, claims["sub"], claims.get("name", ""))


def require_role(role):
    allowed = {
        "Пользователь": ROLES,
        "Руководитель": {"Руководитель", "Администратор"},
        "Администратор": {"Администратор"},
    }[role]

    def check(user=Depends(authenticate)):
        if not user.roles & allowed:
            raise HTTPException(403, "Недостаточно прав")
        return user
    return check
