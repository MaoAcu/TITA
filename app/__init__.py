import pymysql
pymysql.install_as_MySQLdb()   

from flask import Flask
from app.extensions import db
import os
from app.Service import email_service 
from dotenv import load_dotenv   
from .Controllers.routes import routes_bp
from .Controllers.AunthController import auth_bp
from .Controllers.menuController import menu_bp
from .Controllers.credentialController import credential_bp
from app.models import Usuario, Login, Local
 
load_dotenv() 

def create_app():
    app = Flask(__name__)
    
    
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = os.getenv("SECRET_KEY")
    
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 300,  
    }
    
    # Inicializa la base de datos
    db.init_app(app)
    email_service.init_app(app) 
    
    # Seguridad de cookies
    app.config.update(
        SESSION_COOKIE_SECURE=False,        
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_HTTPONLY=True,              
        PERMANENT_SESSION_LIFETIME=1800        
    )
    
    # Registra los blueprints
    app.register_blueprint(routes_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(credential_bp)
    
    return app