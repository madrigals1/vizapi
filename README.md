# VizAPI

**VizAPI** is an API Service, that converts **JSON Data** into **HTML** and returns **PNG** image of **HTML**.

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
- (Optional) [Dockerized Nginx](https://github.com/madrigals1/nginx_proxy_manager) - Will generate SSL certificates and make the app accessible through `HTTPS_NETWORK`, that is set inside `.env`.

## Installation

Make a copy of `.env.example` file named `.env`

```shell script
cp .env.example .env
```

---

Environment variables:
- `PORT` - port on which the app will be running.
- `STATIC_URL` - link to the URL of **Dockerized Static Hosting** + `/vizapi` folder
- `DOCKER_STATIC_HOSTING` - place, where we will save all of our files. Should be also accessible by our **Dockerized Static Hosting** server.
- SSL settings (Not needed without **Dockerized Nginx**):
    - `HTTPS_NETWORK` - network, in which our **Dockerized Nginx** is running. 

```dotenv
PORT=3122
STATIC_URL=http://localhost:8800/vizapi

# Docker settings
DOCKER_STATIC_HOSTING=/var/www/static
HTTPS_NETWORK=https_network

# Google Chart render timeout
RENDER_TIMEOUT_MS=5000
```

---

Create network with the name, that we have in `HTTPS_NETWORK` environment variable.

```shell script
docker network create https_network
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

> `<url>` will be `localhost:${PORT}` if running without **Dockerized Nginx** and you can create **SSL Certificate** and **Proxy Host** using [Dockerized Nginx](https://github.com/madrigals1/nginx_proxy_manager)

### Table Generation

| Name | Table Generation |
| --- | --- |
| Endpoint | `<url>/table` |
| Method | POST |
| Description | Converts JSON Data Table into HTML table and returns screenshot of it |

Example Input

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

Example Result

```
{
    "link": "<static_hosting_url>/table_<uuid4>.png"
}
```

Demo

![Output](https://i.imgur.com/G0nzeuw.png)

---

### Compare Menu

| Name | Compare Menu |
| --- | --- |
| Endpoint | `<url>/compare` |
| Method | POST |
| Description | Converts JSON Compare Data into HTML Compare Data and returns screenshot of it |

Example Input

```json
{
    "left": {
        "image": "https://assets.leetcode.com/users/madrigals1/avatar_1598116159.png",
        "bio_fields": [
            {
                "name": "Name",
                "value": "Adi"
            },
            {
                "name": "Username",
                "value": "madrigals1"
            },
            {
                "name": "Website",
                "value": "https://adigame.dev/"
            },
            {
                "name": "Location",
                "value": "Thailand"
            },
            {
                "name": "Company",
                "value": "Agoda"
            }
        ],
        "compare_fields": [
            {
                "name": "Problems Solved",
                "value": 531
            },
            {
                "name": "Contest Rating",
                "value": 1558
            },
            {
                "name": "Submissions in the last year",
                "value": 757
            },
            {
                "name": "Points",
                "value": 2106
            }
        ]
    },
    "right": {
        "image": "https://assets.leetcode.com/users/dmndcrow/avatar_1567323283.png",
        "bio_fields": [
            {
                "name": "Name",
                "value": "Aibek"
            },
            {
                "name": "Username",
                "value": "dmndcrow"
            },
            {
                "name": "Website",
                "value": ""
            },
            {
                "name": "Location",
                "value": "Kazakhstan"
            },
            {
                "name": "Company",
                "value": ""
            }
        ],
        "compare_fields": [
            {
                "name": "Problems Solved",
                "value": 536
            },
            {
                "name": "Contest Rating",
                "value": 1535
            },
            {
                "name": "Submissions in the last year",
                "value": 609
            },
            {
                "name": "Points",
                "value": 2514
            }
        ]
    }
}
```

Example Result

```
{
    "link": "<static_hosting_url>/compare_<uuid4>.png"
}
```

Demo

![Output](https://i.imgur.com/umOjwVh.png)

---

### Authors
- Adi Sabyrbayev [Github](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)
