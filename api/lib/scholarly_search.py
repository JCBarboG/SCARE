#!/usr/bin/env python3
"""
Wrapper de línea de comandos sobre la librería `scholarly` para SCARE.

Recibe un nombre de autor por argumento y devuelve JSON por stdout con
nombre, afiliación y correo (cuando Google Académico los expone).

Uso:
    python scholarly_search.py "Nombre del Autor"

Requiere: pip install scholarly
"""
import sys
import json

def search_author(name):
    try:
        from scholarly import scholarly
    except ImportError:
        print(json.dumps({"error": "La librería 'scholarly' no está instalada"}))
        sys.exit(1)

    try:
        search_query = scholarly.search_author(name)
        author = next(search_query, None)
        if author is None:
            print(json.dumps({"found": False}))
            return

        filled = scholarly.fill(author, sections=["basics"])
        print(json.dumps({
            "found": True,
            "name": filled.get("name", name),
            "affiliation": filled.get("affiliation") or None,
            "email": filled.get("email_domain") or None,
        }))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Falta el nombre del autor"}))
        sys.exit(1)
    search_author(sys.argv[1])
