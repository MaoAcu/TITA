
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
#SOLO EN LOCALHOST
#from dotenv import load_dotenv

#Sload_dotenv()

import threading
class EmailService:
    def __init__(self):
    
        self.sender_email = None
        self.api_key = None

    def init_app(self, app):
       
        self.sender_email = os.getenv('FROM_EMAIL')
        self.api_key = os.getenv('SENDGRID_API_KEY')

       

    def send_email(self, to_email, subject, html_body):
        try:
            message = Mail(
                from_email=self.sender_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_body
            )
            
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            
           
            return True
            
        except Exception as e:
            print(f" Error enviando correo: {e}")
            return False

            
        except Exception as e:
            print(f"[ERROR] Error enviando correo: {e}")
    def SendVerificationCode(self, email, code):
        try:
            username="Emilio"
            subject = "Tu código de verificación - Paku"
            html = f"""
                <!DOCTYPE html>
                <html lang="es">
                <head>
                   <meta charset="UTF-8">
                   <meta name="viewport" content="width=device-width, initial-scale=1.0">
                   <title>Código de Verificación - Paku</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
                    <table role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 20px 10px;">
                            <table role="presentation" style="width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eeeeee;">
                            
                                <tr>
                                    <td style="background: linear-gradient(135deg, #B62021 0%, #E6871B 100%); padding: 40px 30px; text-align: center;">
                                        <div style=" width: 70px; height: 70px; background: url('https://logic-look.onrender.com/static/img/0.png') no-repeat center; background-size: cover;
                                            border-radius: 50%;
                                            margin: 0 auto 15px;
                                            border: 3px solid #ffffff;
                                        "></div>
                                        <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 1px;">
                                        Verificación de Cuenta
                                        </h1>
                                    </td>
                                </tr>
                            
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="margin: 0 0 15px; color: #2d3436; font-size: 18px; font-weight: 600;">
                                           Hola, {username}
                                        </p>
                                        <p style="margin: 0 0 30px; color: #636e72; font-size: 16px; line-height: 1.6;">
                                            Estás intentando acceder al panel de <strong>Paku</strong>. Para continuar, utiliza el siguiente código de seguridad:
                                        </p>
                                    
                                        <table role="presentation" style="width: 100%; margin: 0 0 30px;">
                                            <tr>
                                                <td style="text-align: center; padding: 30px; background-color: #fdf2f2; border-radius: 15px; border: 2px dashed #B62021;">
                                                    <p style="margin: 0 0 10px; color: #B62021; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">
                                                        Código Temporal
                                                    </p>
                                                    <p style="margin: 0; color: #2d3436; font-size: 48px; font-weight: 800; letter-spacing: 10px; font-family: 'Courier New', monospace;">
                                                        {code}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    
                                    
                                        <p style="margin: 0; color: #b2bec3; font-size: 13px; line-height: 1.6; text-align: center;">
                                            Si no solicitaste este código, puedes ignorar este mensaje o contactar a administración por seguridad.
                                        </p>
                                    </td>
                                </tr>
                            
                                <tr>
                                    <td style="background-color: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                                        <p style="margin: 0 0 5px; color: #B62021; font-size: 18px; font-weight: 700;">
                                           Logic Look
                                        </p>
                                        <p style="margin: 0; color: #999999; font-size: 12px;">
                                            © 2026 Logic Look. Todos los derechos reservados.<br>
                                            Gestión Administrativa Interna.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """

            thread = threading.Thread(target=self.send_email, args=(email, subject, html))
            thread.start()
        except Exception as e:
             print(f"Error enviando código 2FA: {e}")
    def SendUsernameReminder(self, email, uss):
        try:
            subject = "Recuperación de usuario - Paku"
            html = f"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de Usuario - Paku</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
            <table role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto; border-collapse: collapse;">
                <tr>
                    <td style="padding: 20px 10px;">
                        <table role="presentation" style="width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eeeeee;">
                            
                            <tr>
                                <td style="background: linear-gradient(135deg, #B62021 0%, #E6871B 100%); padding: 40px 30px; text-align: center;">
                                    <div style="width: 70px; height: 70px; background: white; border-radius: 50%; margin: 0 auto 15px; overflow: hidden; border: 3px solid #ffffff; display: inline-block;">
                                        <div style="line-height: 70px; font-size: 24px; font-weight: bold; color: #B62021;">P</div>
                                    </div>
                                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">
                                        Recordatorio de Usuario
                                    </h1>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="margin: 0 0 15px; color: #2d3436; font-size: 18px; font-weight: 600;">
                                        ¡Hola!
                                    </p>
                                    <p style="margin: 0 0 25px; color: #636e72; font-size: 16px; line-height: 1.6;">
                                        Has solicitado un recordatorio de tus credenciales de acceso para <strong>Paku</strong>. Aquí tienes tu nombre de usuario registrado:
                                    </p>
                                    
                                    <div style="background-color: #fdf2f2; border-left: 5px solid #B62021; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                                        <span style="display: block; color: #B62021; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; margin-bottom: 5px;">Nombre de Usuario</span>
                                        <span style="font-size: 24px; font-weight: 700; color: #2d3436;">{uss}</span>
                                    </div>
                                    
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                        <tr>
                                            <td style="text-align: center;">
                                                <a href="https://conexionalmarte.onrender.com" 
                                                   style="display: inline-block; background: #B62021; color: #ffffff; text-decoration: none; padding: 15px 45px; border-radius: 12px; font-size: 16px; font-weight: 700; transition: background 0.3s;">
                                                    Ir al Inicio de Sesión
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 0; color: #b2bec3; font-size: 13px; line-height: 1.6; text-align: center;">
                                        Si no solicitaste este recordatorio, puedes ignorar este correo o contactar al administrador del sistema si crees que alguien está intentando acceder a tu cuenta.
                                    </p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="background-color: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                                    <p style="margin: 0 0 5px; color: #B62021; font-size: 18px; font-weight: 700;">
                                        Paku
                                    </p>
                                    <p style="margin: 0; color: #999999; font-size: 12px;">
                                        © 2026 Restaurante Paku. Todos los derechos reservados.<br>
                                        Sistema de Gestión Administrativa.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """

            thread = threading.Thread(target=self.send_email, args=(email, subject, html))
            thread.start()
        except Exception as e:
            print(f"Error al enviar recordatorio de usuario: {e}")