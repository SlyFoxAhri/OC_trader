A server side REST API designed for sharing and trading Original Characters (OCs). Built with Node.js, Express, and Sequlize (SQLite), this project demonstrates software engineering concepts including a clean and structured file system, token based authentication, user management, well-designed data model, atomicity, seand error handling.



## Architecture


### Controller-Service Pattern


Request -> Router -> Middleware -> Controller -> Service -> Database -> Service -> Controller -> Response

Routes only define URL logic. Controllers handle purely HTTP orchestration (request gathering, error-status translations). Services hold all heavy database ORM operations and pure business logic.


### Database Isolation & Atomicity


Implements multi-table relations utilizing Sequelize transactions. Transactions execute atomically, completely wrapping target database operations to eliminate duplicate assets or inconsistencies.


### Security 


Built on custom jsonwebtoken (JWT) middlewares that process authentication alongside flexible Role-Based Access Control (admin vs user) and ownership validity rules.


### Content Management 

Isolated media processing pipelines with multer to safely log full multipart metadata into the database, strictly only serving files according to individual profile visibility rights.



## Folder Structure


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
├── server.js      # Unified web container bootloader
└── README.md      #Documentation
```



## Database Entity-Relationship


Role: id, name

User: id, email, passwordHash, roleId

Character: id, name, age, gender, likes, dislikes, description, visibility, userId

Picture: id, originalName, storedName, mimeType, size, uploadDate, characterId

Trade: id, senderId, recieverId, senderCharacterId, recieverCharacterId, status


### PK -> FK


Role.id -> User.roleId
User.id -> Character.userId
Character.id -> Picture.characterId
User.id -> Trade.senderId 
User.id -> Trade.recieverId
Character.id -> Trade.senderCharacterId
Character.id -> Trade.recieverCharacterId



## API Endpoint Specifications


Required header signature:
Authorization: Bearer <JWT_TOKEN>


### 🔐Authentication Engine


POST /api/auth/register (Public) - New user account creation with validation.

POST /api/auth/login (Public) - Authenticates credentials and issues signed JWTs.


### 🐉Character Operations (CRUD)


POST /api/characters (Protected) - Creates a new character (ownership binds to user but can be changed later).

GET /api/characters (Protected) - Fetches character stats. Standard accounts get public OCs, Admins override to view all.

GET /api/characters/:id (Protected) - Fetches a single OC (strictly blocks guests if profile is set to private).

PUT /api/characters/:id (Protected) - Conditional edit access. Allowed only for the character owner or system admins.

DELETE /api/characters/:id (Protected) - Completely purges character entries. Restricted to owner or admin accounts.

PUT /api/characters/:id/admin-private (Restricted) - Administrative override route. Empowers an admin to forcibly shift any public profile to private.


### 🖼️ Media Processing


POST /api/characters/:characterId/upload (Protected) - Uploads a character avatar (5MB threshold, image-only format constraint). Generates unique stored keys and stores image in the database.

GET /api/pictures/:id/download (Conditional) - Streams or downloads assets. Evaluates parent profile privacy before allowing file access.


### 🔄Transactional Exchange System


POST /api/trades (Protected) - Proposes swapping an owned OC for an external user's public OC.

GET /api/trades (Protected) - Compiles incoming or outgoing trade history related to the user.

PUT /api/trades/:id/respond (Protected) - Recipient can provide accepted or rejected flags. Upon acceptance, a swap of ownership happens.



## Technical Requirements & Installation


Prerequisites:
Node.js (v16+) installed.

Install packages:
npm init -y 
npm install express sequelize sqlite3 jsonwebtoken bcryptjs multer express-validator 

Setup test database:
npm run db:reset

Boot the server
node server.js    #listening at http://localhost:4000.



## Accounts for Sandbox Testing

The accounts are created when reseting the database, the file used to poulate the it can be found at database/seeders/demo-data.js


System Admin Account:
Email: admin@ochub.com
Password: admin123

Standard Account 1 (Alice):
Email: alice@ochub.com
Password: user123
Assets owned: Character ID 1 (Shadow Weaver - Public)

Standard Account 2 (Bob):
Email: bob@ochub.com
Password: user456
Assets owned: Character ID 2 (Sparky - Public)
