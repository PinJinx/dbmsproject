from pydantic import BaseModel
from typing import Literal

class RegisterUser(BaseModel):
    name:str
    email:str
    password:str
    role:Literal["teacher","faculty","admin"]
    dob:str
    address:str


class LoginUser(BaseModel):
    email:str
    password:str



