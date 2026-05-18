import bcrypt

password = "password123"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print(f"Hashed: {hashed}")
check = bcrypt.checkpw(password.encode('utf-8'), hashed)
print(f"Check: {check}")

# Test with string version of hashed
hashed_str = hashed.decode('utf-8') if isinstance(hashed, bytes) else hashed
print(f"Hashed as str: {hashed_str}")
try:
    check_str = bcrypt.checkpw(password.encode('utf-8'), hashed_str.encode('utf-8'))
    print(f"Check with str encoded: {check_str}")
except Exception as e:
    print(f"Check with str encoded failed: {e}")
