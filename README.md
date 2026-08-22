# VizAPI

**VizAPI** is an API service that converts **JSON data** into **PNG images**. Send structured data, get back a hosted image URL.

## Features

### Table Generation — `POST /table`

Converts any JSON array of objects into a styled, striped table image.

![Table Output](https://static.madrigal.pro/vizapi/table_ac3ba659-9f56-49bc-9b53-9b296ef66ef2.png)

### Compare Cards — `POST /compare`

Renders a side-by-side comparison of two entities with avatars, bio fields, and color-coded metric bars.

![Compare Output](https://static.madrigal.pro/vizapi/compare_296b049e-3796-416b-9fda-0596be234142.png)

### Pie Chart — `POST /pie`

Generates a donut/pie chart with a title, legend, and percentage labels.

![Pie Output](https://static.madrigal.pro/vizapi/pie_14e93349-041f-4295-8424-3519c82118e0.png)

### Bar Chart — `POST /bar`

Generates a horizontal stacked bar chart with automatic sorting by total and optional legend.

![Bar Output](https://static.madrigal.pro/vizapi/bar_01dff2eb-9544-422a-a8c3-f2d3b8616829.png)

### Health Checks

| Endpoint | Description |
| --- | --- |
| `GET /` | Returns a running status message |
| `GET /health` | Returns status and uptime |

## Prerequisites

- [Docker and Docker Compose](https://docs.docker.com/compose/install/)
- [Nginx Static Hosting](https://github.com/madrigals1/nginx_static) — serves the generated images
- (Optional) [Nginx Proxy Manager](https://github.com/madrigals1/nginx_proxy_manager) — SSL and HTTPS access

## Installation

```shell
cp .env.example .env
docker network create https_network   # only if using SSL proxy
docker-compose build
docker-compose up
```

### Environment Variables

```dotenv
PORT=3122                                    # API server port
STATIC_URL=http://localhost:8800/vizapi      # Public URL where images are served
DOCKER_STATIC_HOSTING=${HOME}/static        # Local path for image storage
HTTPS_NETWORK=https_network                 # Docker network for SSL proxy
RENDER_TIMEOUT_MS=10000                     # Page render timeout (ms)
```

### Running without Docker

```shell
npm install
npm start
```

## Testing

```shell
npm test    # integration tests (server must be running)
npm run lint
```

## Tech Stack

Node.js, TypeScript, Fastify, Playwright, Apache ECharts, Handlebars, Docker

## Authors

- Adi Sabyrbayev — [GitHub](https://github.com/madrigals1), [LinkedIn](https://www.linkedin.com/in/madrigals1/)
