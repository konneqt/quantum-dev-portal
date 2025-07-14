// Este arquivo é gerado automaticamente.

export const sidebarData = [
  {
    "type": "category",
    "label": "1Password-Connect",
    "items": [
      {
        "type": "doc",
        "id": "1Password-Connect/1-password-connect"
      },
      {
        "type": "category",
        "label": "Items",
        "link": {
          "type": "doc",
          "id": "1Password-Connect/items"
        },
        "items": [
          {
            "type": "doc",
            "id": "1Password-Connect/get-vault-items",
            "label": "Get all items for inside a Vault",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/create-vault-item",
            "label": "Create a new Item",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/get-vault-item-by-id",
            "label": "Get the details of an Item",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/update-vault-item",
            "label": "Update an Item",
            "className": "api-method put"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/patch-vault-item",
            "label": "Update a subset of Item attributes",
            "className": "api-method patch"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/delete-vault-item",
            "label": "Delete an Item",
            "className": "api-method delete"
          }
        ]
      },
      {
        "type": "category",
        "label": "Vaults",
        "link": {
          "type": "doc",
          "id": "1Password-Connect/vaults"
        },
        "items": [
          {
            "type": "doc",
            "id": "1Password-Connect/get-vaults",
            "label": "Get all Vaults",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/get-vault-by-id",
            "label": "Get Vault details and metadata",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Activity",
        "link": {
          "type": "doc",
          "id": "1Password-Connect/activity"
        },
        "items": [
          {
            "type": "doc",
            "id": "1Password-Connect/get-api-activity",
            "label": "Retrieve a list of API Requests that have been made.",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Health",
        "items": [
          {
            "type": "doc",
            "id": "1Password-Connect/get-server-health",
            "label": "Get state of the server and its dependencies.",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/get-heartbeat",
            "label": "Ping the server for liveness",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Metrics",
        "items": [
          {
            "type": "doc",
            "id": "1Password-Connect/get-prometheus-metrics",
            "label": "Query server for exposed Prometheus metrics",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Files",
        "items": [
          {
            "type": "doc",
            "id": "1Password-Connect/get-item-files",
            "label": "Get all the files inside an Item",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/get-details-of-file-by-id",
            "label": "Get the details of a File",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/download-file-by-id",
            "label": "Get the content of a File",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/file",
            "label": "File",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/item",
            "label": "Item",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/field",
            "label": "Field",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/patch",
            "label": "Patch",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/vault",
            "label": "Vault",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/fullitem",
            "label": "FullItem",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/apirequest",
            "label": "APIRequest",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/errorresponse",
            "label": "ErrorResponse",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/generatorrecipe",
            "label": "GeneratorRecipe",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "1Password-Connect/schemas/servicedependency",
            "label": "ServiceDependency",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=1Password-Connect"
      }
    ]
  },
  {
    "type": "category",
    "label": "API-SATVeg-MODIS-v1-1-0",
    "items": [
      {
        "type": "doc",
        "id": "API-SATVeg-MODIS-v1-1-0/api-satveg-modis"
      },
      {
        "type": "category",
        "label": "Série temporal",
        "link": {
          "type": "doc",
          "id": "API-SATVeg-MODIS-v1-1-0/serie-temporal"
        },
        "items": [
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/get-series-1",
            "label": "Retorna uma série temporal EVI ou NDVI a partir de uma coordenada geográfica (longitude e latitude)",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/get-series",
            "label": "Retorna uma série temporal EVI ou NDVI a partir de polígono (conjunto de coordenadas geográficas)",
            "className": "api-method post"
          }
        ]
      },
      {
        "type": "category",
        "label": "Health",
        "link": {
          "type": "doc",
          "id": "API-SATVeg-MODIS-v1-1-0/health"
        },
        "items": [
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/get-health",
            "label": "Retorna o status de funcionamento da API",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/schemas/error",
            "label": "Error",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/schemas/serie",
            "label": "Serie",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/schemas/errorfield",
            "label": "ErrorField",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/schemas/seriepoligono",
            "label": "SeriePoligono",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/schemas/seriefilterponto",
            "label": "SerieFilterPonto",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "API-SATVeg-MODIS-v1-1-0/schemas/seriefilterpoligono",
            "label": "SerieFilterPoligono",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=API-SATVeg-MODIS-v1-1-0"
      }
    ]
  },
  {
    "type": "category",
    "label": "FitnessTrack-API",
    "items": [
      {
        "type": "doc",
        "id": "FitnessTrack-API/fitnesstrack-api"
      },
      {
        "type": "category",
        "label": "UNTAGGED",
        "items": [
          {
            "type": "doc",
            "id": "FitnessTrack-API/get-step-count-for-a-user",
            "label": "Get step count for a user",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "FitnessTrack-API/get-user-workout-data",
            "label": "Get user workout data",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "FitnessTrack-API/get-heart-rate-data-for-a-user",
            "label": "Get heart rate data for a user",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "FitnessTrack-API/schemas/steps",
            "label": "Steps",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "FitnessTrack-API/schemas/workout",
            "label": "Workout",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "FitnessTrack-API/schemas/heartrate",
            "label": "HeartRate",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=FitnessTrack-API"
      }
    ]
  },
  {
    "type": "category",
    "label": "Gov-API",
    "items": [
      {
        "type": "doc",
        "id": "Gov-API/from-scratch"
      },
      {
        "type": "category",
        "label": "UNTAGGED",
        "items": [
          {
            "type": "doc",
            "id": "Gov-API/retrieve-objects",
            "label": "Retrieve Objects",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Gov-API/retrieve-operations",
            "label": "Retrieve Operations",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=Gov-API"
      }
    ]
  },
  {
    "type": "category",
    "label": "IP-geolocation-API-v1-1-0",
    "items": [
      {
        "type": "doc",
        "id": "IP-geolocation-API-v1-1-0/ip-geolocation-api"
      },
      {
        "type": "category",
        "label": "UNTAGGED",
        "items": [
          {
            "type": "doc",
            "id": "IP-geolocation-API-v1-1-0/retrieve-teste",
            "label": "Retrieve Teste",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "IP-geolocation-API-v1-1-0/retrieve-v-1-1-0",
            "label": "Retrieve V1.1.0",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "IP-geolocation-API-v1-1-0/schemas/inline-response-200",
            "label": "inline_response_200",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=IP-geolocation-API-v1-1-0"
      }
    ]
  },
  {
    "type": "category",
    "label": "MusicStream-API",
    "items": [
      {
        "type": "doc",
        "id": "MusicStream-API/musicstream-api"
      },
      {
        "type": "category",
        "label": "UNTAGGED",
        "items": [
          {
            "type": "doc",
            "id": "MusicStream-API/get-a-list-of-songs",
            "label": "Get a list of songs",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "MusicStream-API/get-playlists",
            "label": "Get playlists",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "MusicStream-API/get-song-details",
            "label": "Get song details",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "MusicStream-API/schemas/song",
            "label": "Song",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "MusicStream-API/schemas/playlist",
            "label": "Playlist",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=MusicStream-API"
      }
    ]
  },
  {
    "type": "category",
    "label": "Pet-Store",
    "items": [
      {
        "type": "doc",
        "id": "Pet-Store/swagger-petstore-openapi-3-0"
      },
      {
        "type": "category",
        "label": "pet",
        "link": {
          "type": "doc",
          "id": "Pet-Store/pet"
        },
        "items": [
          {
            "type": "doc",
            "id": "Pet-Store/update-pet",
            "label": "Update an existing pet",
            "className": "api-method put"
          },
          {
            "type": "doc",
            "id": "Pet-Store/add-pet",
            "label": "Add a new pet to the store",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "Pet-Store/find-pets-by-status",
            "label": "Finds Pets by status",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/find-pets-by-tags",
            "label": "Finds Pets by tags",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/get-pet-by-id",
            "label": "Find pet by ID",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/update-pet-with-form",
            "label": "Updates a pet in the store with form data",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "Pet-Store/delete-pet",
            "label": "Deletes a pet",
            "className": "api-method delete"
          },
          {
            "type": "doc",
            "id": "Pet-Store/upload-file",
            "label": "uploads an image",
            "className": "api-method post"
          }
        ]
      },
      {
        "type": "category",
        "label": "store",
        "link": {
          "type": "doc",
          "id": "Pet-Store/store"
        },
        "items": [
          {
            "type": "doc",
            "id": "Pet-Store/get-inventory",
            "label": "Returns pet inventories by status",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/place-order",
            "label": "Place an order for a pet",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "Pet-Store/get-order-by-id",
            "label": "Find purchase order by ID",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/delete-order",
            "label": "Delete purchase order by ID",
            "className": "api-method delete"
          }
        ]
      },
      {
        "type": "category",
        "label": "user",
        "link": {
          "type": "doc",
          "id": "Pet-Store/user"
        },
        "items": [
          {
            "type": "doc",
            "id": "Pet-Store/create-user",
            "label": "Create user",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "Pet-Store/create-users-with-list-input",
            "label": "Creates list of users with given input array",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "Pet-Store/login-user",
            "label": "Logs user into the system",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/logout-user",
            "label": "Logs out current logged in user session",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/get-user-by-name",
            "label": "Get user by user name",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "Pet-Store/update-user",
            "label": "Update user",
            "className": "api-method put"
          },
          {
            "type": "doc",
            "id": "Pet-Store/delete-user",
            "label": "Delete user",
            "className": "api-method delete"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "Pet-Store/schemas/order",
            "label": "Order",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "Pet-Store/schemas/customer",
            "label": "Customer",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "Pet-Store/schemas/address",
            "label": "Address",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "Pet-Store/schemas/category",
            "label": "Category",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "Pet-Store/schemas/user",
            "label": "User",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "Pet-Store/schemas/tag",
            "label": "Tag",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "Pet-Store/schemas/pet",
            "label": "Pet",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "Pet-Store/schemas/apiresponse",
            "label": "ApiResponse",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=Pet-Store"
      }
    ]
  },
  {
    "type": "category",
    "label": "PetCare-API",
    "items": [
      {
        "type": "doc",
        "id": "PetCare-API/petcare-api"
      },
      {
        "type": "category",
        "label": "UNTAGGED",
        "items": [
          {
            "type": "doc",
            "id": "PetCare-API/get-a-list-of-pet-breeds",
            "label": "Get a list of pet breeds",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "PetCare-API/get-breed-details",
            "label": "Get breed details",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "PetCare-API/get-veterinary-services",
            "label": "Get veterinary services",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "PetCare-API/schemas/breed",
            "label": "Breed",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "PetCare-API/schemas/veterinaryservice",
            "label": "VeterinaryService",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=PetCare-API"
      }
    ]
  },
  {
    "type": "category",
    "label": "Telco-API-v1-1-0",
    "items": [
      {
        "type": "doc",
        "id": "Telco-API-v1-1-0/telco-api"
      },
      {
        "type": "category",
        "label": "UNTAGGED",
        "items": [
          {
            "type": "doc",
            "id": "Telco-API-v1-1-0/create-send-sms",
            "label": "Create Send Sms",
            "className": "api-method post"
          },
          {
            "type": "doc",
            "id": "Telco-API-v1-1-0/retrieve-sms-balance",
            "label": "Retrieve Sms Balance",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "Telco-API-v1-1-0/schemas/qap-telco-apisend-sms",
            "label": "Qap-Telco-apisend-sms",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=Telco-API-v1-1-0"
      }
    ]
  },
  {
    "type": "category",
    "label": "TravelExplore-API",
    "items": [
      {
        "type": "doc",
        "id": "TravelExplore-API/travelexplore-api"
      },
      {
        "type": "category",
        "label": "UNTAGGED",
        "items": [
          {
            "type": "doc",
            "id": "TravelExplore-API/get-a-list-of-travel-destinations",
            "label": "Get a list of travel destinations",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "TravelExplore-API/get-accommodation-options",
            "label": "Get accommodation options",
            "className": "api-method get"
          },
          {
            "type": "doc",
            "id": "TravelExplore-API/get-destination-details",
            "label": "Get destination details",
            "className": "api-method get"
          }
        ]
      },
      {
        "type": "category",
        "label": "Schemas",
        "items": [
          {
            "type": "doc",
            "id": "TravelExplore-API/schemas/destination",
            "label": "Destination",
            "className": "schema"
          },
          {
            "type": "doc",
            "id": "TravelExplore-API/schemas/accommodation",
            "label": "Accommodation",
            "className": "schema"
          }
        ]
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=TravelExplore-API"
      }
    ]
  },
  {
    "type": "category",
    "label": "sss",
    "items": [
      {
        "type": "doc",
        "id": "sss/sss"
      },
      {
        "type": "link",
        "label": "OWASP API Security Report",
        "href": "/OWASPValidationPage?apiName=sss"
      }
    ]
  }
];
