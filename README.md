# KJaga REST API Backend Service
This service use the following tech stacks:
1. TypeScript
2. Node JS
3. PostgreSQL
4. Google's Cloud Storage

## Getting Started

First, install the dependencies the development server:
```bash
npm run install
```
Create a .env file, look at .env.example for the format. These are the description for each values:
| Value  | Description  | 
| :------------ |:---------------| 
| PG_HOST | Host of the database. e.g localhost, Ip address |
| PG_USER | Postgres username |
| PG_PASSWORD | Postgres password |
| PG_DATABASE | Database Name |
| JWT_SECRET | A secret string for auth purpose |
| UPLOAD_BUCKET_NAME | Bucket name for image upload purpose |

Run the development server:
```bash
npm run dev
```

All endpoints available are documented using OpenAPI Swagger. Access it through [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
