# A temporary script to get the hashed password
from utils.security import hash_password

plain_password = "admin1234"
hashed_password = hash_password(plain_password)
print(hashed_password)