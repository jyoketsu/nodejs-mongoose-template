# nodejs-mongoose-template

An application built using the `Express` + `TypeScript` + `Mongoose`.

Generate private.pem and public.pem keys for JSON Web Token (JWT) and use the RS256 algorithm for encryption.

```bash
# Generate private key (private.pem):
openssl genpkey -algorithm RSA -out private.pem -aes256

# Extract public key from private key (public.pem)
openssl rsa -pubout -in private.pem -out public.pem

```

## Start

yarn start

## Build

yarn build

## Mongoose docs

https://mongoosejs.com/docs/guide.html

## Swagger UI

http://localhost:8099/api-docs/

## Swagger docs

https://swagger.io/docs/specification/about/
