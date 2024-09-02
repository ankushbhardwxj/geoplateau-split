## Backend Assignment

### System Design 

- API: We assume client uses HTTP polling, therefore, service is an express server
- Validation: GeoJSON input validation must be done before processing, therefore, we do it at a route middleware. We use Zod to validate the request body received, and then further validate the GeoJSON data.
- Database: We choose NoSQL (mongodb). Inbuilt support for GeoJSON data, and optimistic concurrency control
  - Conflict Resolution: We use async-retry package, to retry gracefully if there's a conflict/error.

### Getting Started

NOTE: Add a `.env` file to the root of the project, with the following properties: 
```
# Environment Configuration
NODE_ENV="development" # Options: 'development', 'production'
PORT="8081"            # The port your server will listen on
HOST="localhost"       # Hostname for the server

# CORS Settings
CORS_ORIGIN="http://localhost:*" # Allowed CORS origin, adjust as necessary

# Rate Limiting
COMMON_RATE_LIMIT_WINDOW_MS="1000" # Window size for rate limiting (ms)
COMMON_RATE_LIMIT_MAX_REQUESTS="20" # Max number of requests per window per IP

# Database Configuration
MONGO_URI="mongodb+srv://<usernaem>:<password>@geoplateau-split.nkkc8.mongodb.net/?retryWrites=true&w=majority&appName=geoplateau-split" # MongoDB connection URI
```

```bash
# install dependencies
npm install

# run development server
npm run dev

# build and run production server 
npm run build
npm run start

# lint/format
npm run lint
npm run lint:fix
npm run format
```

### Testing

We use vitest for running tests. 
```
npm run test
```
We test concurrency and performance using K6. 
```
brew install k6
k6 run script.js
```

### CI/CD, Hosting

On every push to master, we run lint checks, build server, and run all tests.
Server hosted on Render at URL: https://geoplateau-split.onrender.com

Swagger API docs at: https://geoplateau-split.onrender.com

<details>
  <summary>Sample curl request</summary>
  
  ## Curl Request

```bash
curl --location --request POST 'https://geoplateau-split.onrender.com/api/v1/geo/split-building-limit' \
--header 'Content-Type: application/json' \
--data-raw '{
  "refid": 3243211111,
  "building_limits": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                10.757867266534337,
                59.91339283457274
              ],
              [
                10.756516000002959,
                59.913633000004204
              ],
              [
                10.756398999995643,
                59.91346700000333
              ],
              [
                10.75628300000438,
                59.91330300000502
              ],
              [
                10.756052815307351,
                59.91297582153187
              ],
              [
                10.756245682709302,
                59.912959479672516
              ],
              [
                10.757486364709461,
                59.91285434826322
              ],
              [
                10.757867266534337,
                59.91339283457274
              ]
            ]
          ]
        }
      }
    ]
  },
  "height_plateaus": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                10.75678086443506,
                59.91291413160555
              ],
              [
                10.757486364709461,
                59.91285434826322
              ],
              [
                10.757867266534337,
                59.91339283457274
              ],
              [
                10.757212164399775,
                59.91350927037677
              ],
              [
                10.75678086443506,
                59.91291413160555
              ]
            ]
          ]
        },
        "properties": {
          "elevation": 3.63
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                10.756996990155885,
                59.91321236033006
              ],
              [
                10.757212164399775,
                59.91350927037677
              ],
              [
                10.756516000002959,
                59.913633000004204
              ],
              [
                10.756398999995643,
                59.91346700000333
              ],
              [
                10.756312148500106,
                59.91334421011477
              ],
              [
                10.756996990155885,
                59.91321236033006
              ]
            ]
          ]
        },
        "properties": {
          "elevation": 4.63
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                10.756312148500106,
                59.91334421011477
              ],
              [
                10.75628300000438,
                59.91330300000502
              ],
              [
                10.756052815307351,
                59.91297582153187
              ],
              [
                10.756245682709302,
                59.912959479672516
              ],
              [
                10.75678086443506,
                59.91291413160555
              ],
              [
                10.756996990155885,
                59.91321236033006
              ],
              [
                10.756312148500106,
                59.91334421011477
              ]
            ]
          ]
        },
        "properties": {
          "elevation": 2.63
        }
      }
    ]
  }
}'
```

</details>

