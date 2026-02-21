from flask import Blueprint, jsonify,request,current_app
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models.menu import Menu
import uuid, os

UPLOAD_FOLDER = os.path.join('app', 'static', 'images', 'menu')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

menu_bp = Blueprint("menu", __name__, url_prefix='/menu')


@menu_bp.route("/getmenu", methods=["GET"])
def GetMenu():
    try:
        local_id = 3

        menus = Menu.query.filter_by(local=local_id, estado=1).all()

        data = [
            {
                "idmenu": m.idmenu,
                "local": m.local,
                "nombre": m.nombre,
                "descripcion": m.descripcion,
                "precio": float(m.precio),
                "imagen": m.imagen,
                "categoria": m.categoria,
                "estado": m.estado,
                "subcategoria": m.subcategoria,
                "destacado": m.destacado
            }
            for m in menus
        ]
    
        return jsonify(data), 200

    except Exception as e:
        print(f"[ERROR get_menu]: {e}")
        return jsonify({"error": "No se pudo obtener el menú"}), 500
    
#crear nuevo producto 
@menu_bp.route("/menu", methods=["POST"])
def CreateMenuSection():
    try:
        data = request.form
        file = request.files.get('image')

        
        if not data.get("nombre") or not data.get("precio") or not data.get("categoria"):
            return jsonify({
                "error": "nombre, precio y categoria son obligatorios"
            }), 400

        filename = None

        if file and allowed_file(file.filename):
            ext = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{uuid.uuid4().hex}.{ext}"

            filepath = os.path.join(
                current_app.root_path,
                'static', 'images', 'menu', filename
            )
            file.save(filepath)

        menu = Menu(
            local=1,
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion'),
            precio=data.get('precio'),
            imagen=filename,
            categoria=data.get('categoria'),
            estado=data.get('estado', 'active'),
            subcategoria=data.get('subcategoria')
        )

        db.session.add(menu)
        db.session.commit()

        return jsonify({"message": "Producto creado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR CreateMenuSection]: {e}")
        return jsonify({"error": "Error al crear producto"}), 500
#funcion auxiliar
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS    
    
@menu_bp.route("/menu/<int:idmenu>", methods=["PATCH"])
def PatchMenuSection(idmenu):
    try:
        menu = Menu.query.filter_by(idmenu=idmenu, local=1).first()
        if not menu:
            return jsonify({"error": "Producto no encontrado"}), 404

        data = request.form
        file = request.files.get("image")
        
        # Imagen 
        if file and allowed_file(file.filename):
            ext = file.filename.rsplit(".", 1)[1].lower()
            filename = f"{uuid.uuid4().hex}.{ext}"

            upload_path = os.path.join(
                current_app.root_path,
                "static", "images", "menu"
            )
            os.makedirs(upload_path, exist_ok=True)

            filepath = os.path.join(upload_path, filename)
            file.save(filepath)

            # eliminar imagen anterior
            if menu.imagen:
                old_path = os.path.join(upload_path, menu.imagen)
                if os.path.exists(old_path):
                    os.remove(old_path)

            menu.imagen = filename

        #  Campos editables 
        campos = {
            "nombre": data.get("nombre"),
            "descripcion": data.get("descripcion"),
            "precio": data.get("precio"),
            "categoria": data.get("categoria"),
            "subcategoria": data.get("subcategoria"),
            "estado": data.get("estado"),
        }

        for campo, valor in campos.items():
            if valor is not None:
                setattr(menu, campo, valor)

        db.session.commit()

        return jsonify({"message": "Producto actualizado parcialmente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR PatchMenu]: {e}")
        return jsonify({"error": "No se pudo actualizar"}), 500
    
@menu_bp.route("/menu/<int:idmenu>", methods=["DELETE"])
def DeleteMenu(idmenu):
    try:
        menu = Menu.query.filter_by(idmenu=idmenu, local=1).first()

        if not menu:
            return jsonify({"error": "Producto no encontrado"}), 404

        db.session.delete(menu)
        db.session.commit()

        return jsonify({"message": "Producto eliminado permanentemente"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[ERROR DeleteMenu]: {e}")
        return jsonify({"error": "No se pudo eliminar el producto"}), 500
