
import sys

try:
    with open('current_build_error.txt', 'r', encoding='utf-16-le') as f:
        print(f.read())
except Exception as e:
    try:
        with open('current_build_error.txt', 'r', encoding='utf-8') as f:
            print(f.read())
    except Exception as e2:
        print(f"Error reading file: {e}, {e2}")
