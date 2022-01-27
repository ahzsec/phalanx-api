_________________________________________________
# Subdomains

## Create Subs
### POST
>```
>/subs
>```
### Body

```json
{
    "domain": "example.com",
    "subdomains": ["account.example.com","dashboard.example.com","portal.example.com"]
}
```
_________________________________________________
</br>

## User Domain Subs
### GET
>```
>/subs?sortBy=createdAt:desc
>```
### Query Params:

|Param|value|
|---|---|
|sortBy|createdAt:desc|
_________________________________________________
</br>

## User Subs
### GET
>```
>/subs?d=example.com
>```
### Query Params:

|Param|value|
|---|---|
|d|example.com|
_________________________________________________
</br>

## Update Subs
### PUT
>```
>/subs?d=example.com
>```
### Body

```json
{
    "domain": "example.com",
    "subdomains": ["account.example.com","dashboard.example.com","portal.example.com"]

}
```
### Query Params:

|Param|value|
|---|---|
|d|example.com|
_________________________________________________
</br>

## Delete Subs
### DELETE
>```
>/subs?d=example.com
>```
### Query Params:

|Param|value|
|---|---|
|d|example.com|
</br>

_________________________________________________
# Users

## Signup
### POST
>```
>/signup
>```
### Body

```json
{
    "username": "username",
    "email": "example@example.com",
    "admin": 1
}
```
_________________________________________________
</br>

## Account Verification
### POST
>```
>/verify?tkn=
>```
### Body

```json
{
    "password": "password"
}
```

### Query Params:

|Param|value|
|---|---|
|tkn||
_________________________________________________
</br>

## Login
### POST
>```
>/login
>```
### Body

```json
{
    "email": "example@example.com",
    "password": "password"
}
```
_________________________________________________
</br>

## Upload Avatar
### POST
>```
>/profile/avatar
>```
### Body formdata:

|Param|value|Type|
|---|---|---|
|avatar|Avatar Pic|file|
_________________________________________________
</br>

## Logout
### GET
>```
>/logout
>```
_________________________________________________
</br>

## Full Logout
### GET
>```
>/logout?t=full
>```
### Query Params:

|Param|value|
|---|---|
|t|full|
_________________________________________________
</br>

## Profile
### GET
>```
>/profile
>```
### Headers

|Content-Type|Value|
|---|---|
|Authorization|Bearer JWT
_________________________________________________
</br>

## Get Users
### GET
>```
>/users
>```
_________________________________________________
</br>

## Update User
### PUT
>```
>/profile
>```
### Body

```json
{
    "password": "password"
}
```
_________________________________________________
</br>

## Delete Avatar
### DELETE
>```
>/profile/avatar
>```
_________________________________________________
</br>

## Delete Profile
### DELETE
>```
>/profile
>```
_________________________________________________
