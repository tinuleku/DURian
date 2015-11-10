# Session #

## 1. Account ##

An account refers to a user on a given database. An account can be identified by a database and the username for this database.
Only the databse detail and the username are stored in the local database. No password is stored.

## 2.Authentication ##

The authentication is based on a database, a username and a password. 
The authentication is tested against the database connection. 
If the connection can be established, we assume it s a successful authentication. 
To avoid sending the credential multiple times, we keep the connection open. The connection is attached to a session object on server side.

## 3.Session ##
On client side, the authentication is handled by token. 
On server side the token attached to the query is used to determine the session. 
The session has a short expiry time (configurable).
