# Open Wallet
A work in progress - Experiment in which we attempt to manage invoices, expenses, budgets and analysis in a transparent manner.

## .env
```MONGODB_URI``` Path to reach your database (e.g.```mongodb+srv://<username>:<password>@cluster0-e7fdv.mongodb.net/test?retryWrites=true```)  

```DB_NAME``` The database name (e.g. ```open-wallet``` or ```test```)  

```APP_SECRET``` A secret used by JWT to sign tokens, e.g. ```A secret is a secret``` (this is not a good secret)  

```CLOUDINARY_URL``` e.g. ```cloudinary://<my_key>:<my_secret>@<my_cloud_name>```

```STRING_MAX_CHAR``` maximum string length authorized for user inputs (```default 500```)

```HASH_ROUNDS``` bcrypt hash rounds (```default 10```) 

```INVOICE_REF_SIZE``` number of characters of an invoice reference (```default 4```)

[See example](./backend/.env.example)
