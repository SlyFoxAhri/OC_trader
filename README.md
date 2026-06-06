---

A server side REST API designed for sharing and trading Original Characters (OCs). Built with Node.js, Express, and Sequlize (SQLite), this project demonstrates software engineering concepts including a clean and structured file system, token based authentication, user management, well-designed data model, atomicity, seand error handling.

---


# Architecture


## Controller-Service Pattern


Routes only define URL logic. Controllers handle purely HTTP orchestration (request gathering, error-status translations). Services hold all heavy database ORM operations and pure business logic.

>Request -> Router -> Middleware -> Controller -> Service -> Database -> Service -> Controller -> Response


## Database Isolation & Atomicity


Implements multi-table relations utilizing Sequelize transactions. Transactions execute atomically, completely wrapping target database operations to eliminate duplicate assets or inconsistencies.


## Security 


Built on custom jsonwebtoken (JWT) middleware that process authentication alongside flexible Role-Based Access Control (admin vs user) and ownership validity rules.


## Content Management 

Isolated media processing pipelines with multer to safely log full multipart metadata into the database, strictly only serving files according to individual profile visibility rights.



# Folder Structure


```
oc-trader/ 
├── config/
├── controllers/
├── database/
├── middlewares/
├── models/
├── routes/
├── services/
├── uploads/
├── server.js      # Unified bootloader
└── README.md      # Documentation
```



# Database Entity-Relationship


**Role**: id, name\
**User**: id, email, passwordHash, roleId\
**Character**: id, name, age, gender, likes, dislikes, description, visibility, userId\
**Picture**: id, originalName, storedName, mimeType, size, uploadDate, characterId\
**Trade**: id, senderId, recieverId, senderCharacterId, recieverCharacterId, status

<br>

| Primary-key | -> | Foreign-key |
|---|---|---|
|Role.id |->| User.roleId|
|User.id |->| Character.userId|
|Character.id |->| Picture.characterId|
|User.id |->| Trade.senderId |
|User.id |->| Trade.recieverId|
|Character.id |->| Trade.senderCharacterId|
|Character.id |->| Trade.recieverCharacterId|



# API Endpoint Specifications

>More at [this link](#examples)

>[!CAUTION]
>Required header signature:\
>Authorization: Bearer <JWT_TOKEN>


### 🪪Authentication Engine - Public


>     POST /api/auth/register

>     POST /api/auth/login


### 🐉Character Operations (CRUD) - Protected


>     POST /api/characters

>     GET /api/characters

>     GET /api/characters/:id

>     PUT /api/characters/:id

>     DELETE /api/characters/:id

>     PUT /api/characters/:id/admin-private


### 🗃️ Media Processing


>     POST /api/characters/:characterId/upload

>     GET /api/pictures/:id/download 


### 🔄Transactional Exchange System - Protected


>     POST /api/trades

>     GET /api/trades

>     PUT /api/trades/:id/respond



# Technical Requirements & Installation


Prerequisites:\
**Node.js (v16+) installed**

Install packages:
```
npm init -y 
npm install express sequelize sqlite3 jsonwebtoken bcryptjs multer express-validator 
```

Setup test database:
```
npm run db:reset
```

Boot the server:
```
node server.js    #listening at http://localhost:4000.
```


# Accounts for Sandbox Testing

>[!NOTE]
>The accounts are created when reseting the database \
>The file used to poulate the it can be found at **database/seeders/demo-data.js**


System Admin Account:
```
admin@ochub.com:admin123
```

User Account 1 (Alice):\
assets: CharacterID 1 (Shadow Weaver)
```
alice@ochub.com:user123
```

User Account 2 (Bob):\
assets: CharacterID 2 (Sparky)
```
bob@ochub.com:user456
```

---


### Examples

>[!NOTE]
>Required header signature:\
>Authorization: Bearer <JWT_TOKEN>

---

**🪪 Authentication Engine - Public**

- New user account creation with validation:

    >No header\
    >     POST /api/auth/register 
    ```json
     {
      "email": "alice@ochub.com",
      "password": "user123"
    }
    ```

- Authenticate credentials and issues signed JWTs:

    >No header\
    >     POST /api/auth/login
    ```json
    {
      "email": "bob@ochub.com",
      "password": "user456"
    }
    ```

---

***🐉 Character Operations (CRUD) - Protected***


- Creates a new character (ownership binds to user but can be changed later):

    >     POST /api/characters
    ```json
    {
      "name": "Crimson Blade",
      "age": 24,
      "gender": "Female",
      "likes": "Swords, Tea",
      "dislikes": "Dishonesty",
      "description": "A wandering knight.",
      "visibility": "public"
    }
    ```

- Fetches character stats. Standard accounts get public OCs, Admins override to view all:

    >     GET /api/characters

- Fetches a single OC (strictly blocks guests if profile is set to private):

    >     GET /api/characters/1

- Conditional edit access. Allowed only for the character owner or system admins:

    >     PUT /api/characters/1 
    ```json
    {
      "id": 1,
      "age": 25,
      "visibility": "private"
    }
    ```

- Completely purges character entries. Restricted to owner or admin accounts:

    >     DELETE /api/characters/1

- Administrative override route. Empowers an admin to forcibly shift any public profile to private (RESTRICTED):

    >     PUT /api/characters/4/admin-private
 

---

***🗃️ Media Processing***


- Uploads a character avatar (5MB threshold, image-only format constraint). Generates unique stored keys and stores image in the database (PROTECTED):

    >     POST /api/characters/3/upload 

- Streams or downloads assets. Evaluates parent profile privacy before allowing file access (CONDITIONAL):

    >     GET /api/pictures/2/download 

---

***🔄 Transactional Exchange System - Protected***

-Proposes swapping an owned OC for an external user's public OC:

    >     POST /api/trades
    ```json
    {
      "senderCharacterId": 1,
      "receiverCharacterId": 2
    }
    ```

- Compiles incoming or outgoing trade history related to the user:

    >     GET /api/trades

- Recipient can provide accepted or rejected flags. Upon acceptance, a swap of ownership happens:

    >     PUT /api/trades/1/respond



























