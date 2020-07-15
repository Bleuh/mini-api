# MiNi-API

API example in Typescript.

Context :

You were recently been recruited by MiNi, a company that produce personalized, selfpowered, articulated figures mimicking your movement in real-time using your webcam or
other sensors. The KickStarter project went viral and now, it will be your job to allow MiNi to
hit the market. Your task is to design the API that will help MiNi fast expansion: the MiNi-API.

The API will be placed between the user and the factory.

The main purpose of the api is to manage orders from users.

## Features

### User

- [Register/Login](#register/login)
- [Create order](#create-order)
- [Show order list](#show-order-list)
- [Show order status](#show-order-status)

### Factory

- [Collect new orders](#collect-new-orders)
- [Add serial number to ordered items](#add-serial-number-to-ordered-items)
- [Update orders status](#update-orders-status)

## How to launch

```bash
# Clone the project
git clone https://github.com/Bleuh/AlexaV2

# Install dependencies
npm i
```

I recommanded to use docker to launch the project.
You can find the install process [here](https://docs.docker.com/get-docker/)

```bash
docker-compose up
```

If you don't have docker, use the default `npm start`, but you need to have the right environment.

You can now use the api on `http://localhost:3000/`

- I'm using a specific product in all examples (56cb91bdc3464f14678934ca), you can create it by run `npm run seed` after your app was launched.

## Routes available

I will show you here some example for each route

> /

This route gives you all routes available

### Register/Login

> /register

```bash
curl --location --request POST 'localhost:3000/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'login=foo' \
--data-urlencode 'password=foo-password'
```

```bash
curl --location --request POST 'localhost:3000/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'login=foo' \
--data-urlencode 'password=foo-password'
```

Login will give you a unique token, you need to use for all other orders routes

### Create order

> /order/create

```bash
curl --location --request POST 'localhost:3000/order/create' \
--header 'Authorization: Bearer your-token ' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'orders=[{"productId":"56cb91bdc3464f14678934ca", "quantity":  1}]'
```

### Show order list

> /order/list

```bash
curl --location --request GET 'localhost:3000/order/list' \
--header 'Authorization: Bearer your-token'
```

### Show order status

> /order/status

```bash
curl --location --request GET 'localhost:3000/order/status' \
--header 'Authorization: Bearer your-token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'orderID=5f0a8b6e6b0e5f0193ccbcd3'
```

### Collect new orders

> /factory/order/new-orders

```bash
curl --location --request POST 'localhost:3000/factory/order/new-orders'
```

Will return you a list of all order with 'Pending' status

### Add serial number to ordered items

> /factory/order/set-serial

```bash
curl --location --request GET 'localhost:3000/factory/order/set-serial' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'orderID=5f0a8b6e6b0e5f0193ccbcd3' \
--data-urlencode 'serials={"5f0a8b6e6b0e5f0193ccbcd5": "serial-code"}'
```

"Serials" is an object who contains id product as key and corresponding serial code as value

### Update orders status

> /factory/order/update-status

```bash
curl --location --request GET 'localhost:3000/factory/order/update-status' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'orderID=5f0a8b6e6b0e5f0193ccbcd3' \
--data-urlencode 'status=Production'
```

Status is tested and can only be : "Pending", "Production", "Complete" or "Shipped"

## Improvement needed

### Unit test

I did not successfully mock the API with jest (around 1 day try), I try to mock my own class but it's provoke the app to crash (with supertest).

2 possible ways I found to do it :

- Move my logic to another file and mock them instead
- Create fake express request and response and test all the logic with it

By lack of time, I did not finish it and it's needed !

### Factory serurity

All factory route are not secured right now.

In my mind, this kind of structure is secured by a VPN because we only have API <> Factory.
