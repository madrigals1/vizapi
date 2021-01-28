# VizAPI

**VizAPI** is an API Service, that converts **JSON Dictionaries** into **HTML Tables** and returns **PNG** image of **HTML Table**.

## Demo

```JSON
{
    "table": [
        {
            "Name": "Lorem ipsum dolor sit amet",
            "Time": "4 days ago",
            "Language": "Python3",
            "Status": "💚 Accepted"
        },
        {
            "Name": "Consectetur adipiscing elit",
            "Time": "7 days ago",
            "Language": "C++",
            "Status": "🤬 Time Limit Exceeded"
        },
        {
            "Name": "Sed do eiusmod tempor incididunt",
            "Time": "2 weeks ago",
            "Language": "Java",
            "Status": "😢 Wrong Answer"
        }
    ]
}
```

![Output](https://i.imgur.com/G0nzeuw.png)

## Prerequisites

Make sure you have installed these:
- [Docker and Docker Compose](https://phoenixnap.com/kb/install-docker-compose-on-ubuntu-20-04) - Will install all the required packages and software.
- [Dockerized Static Hosting](https://github.com/madrigals1/nginx_static) - Hosting generated images using **Nginx + Docker**.
- (Optional) [Dockerized Nginx with SSL](https://github.com/madrigals1/nginx) - Will generate SSL certificates and make the app accessible through `SSL_DOMAIN`, that is set inside `.env`.

## Installation

Make a copy of .env.example file named .env

```shell script
cp .env.example .env
```

---

Environment variables:
- `PORT` - port on which the app will be running.
- `STATIC_URL` - link to the URL of **Dockerized Static Hosting** + `/vizapi` folder
- `DOCKER_STATIC_HOSTING` - place, where we will save all of our files. Should be also accessible by our **Dockerized Static Hosting** server.
- SSL settings (Not needed without **Dockerized Nginx**):
    - `SSL_DOMAIN` - domain of the website with VizAPI
    - `LETSENCRYPT_EMAIL` - Email for LetsEncrypt notifications.
    - `NGINX_PROXY_NETWORK` - network, in which our HTTPS server will be running. 

```dotenv
PORT=3122
STATIC_URL="http://localhost:8800/vizapi"

# Docker settings
SSL_DOMAIN="vizapi.example.com"
LETSENCRYPT_EMAIL="user@example.com"
DOCKER_STATIC_HOSTING="/var/www/static"
NGINX_PROXY_NETWORK="nginx-proxy"
```

---

Create network with the name, that we have in `NGINX_PROXY_NETWORK` environment variable.

```shell script
docker network create nginx-proxy
```

---

Build the Docker image

```shell script
docker-compose build
```

## Running

Start
```
docker-compose up
```

Stop
```
docker-compose down
```

## Usage

Send POST request for `<url>/table`

> `<url>` will be `localhost:PORT` if running without **Dockerized Nginx** and `SSL_DOMAIN` if running with **Dockerized Nginx** 

```
{
    "table": [
        {
            "Name": "Lorem ipsum dolor sit amet",
            "Time": "4 days ago",
            "Language": "Python3",
            "Status": "💚 Accepted"
        },
        {
            "Name": "Consectetur adipiscing elit",
            "Time": "7 days ago",
            "Language": "C++",
            "Status": "🤬 Time Limit Exceeded"
        },
        {
            "Name": "Sed do eiusmod tempor incididunt",
            "Time": "2 weeks ago",
            "Language": "Java",
            "Status": "😢 Wrong Answer"
        }
    ]
}
```

Result
```
{
    "link": "<static_hosting_url>/table_<uuid4>.png"
}
```

### Authors
- Adi Sabyrbayev [Github](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)
