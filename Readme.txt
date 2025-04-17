# Start server
    node server.js

# Generate HTTPS Certificate
To enable HTTPS, you need to create `key.pem` and `cert.pem` files. Follow these steps:

1. Navigate to the `cert` directory:
    ```bash
    mkdir -p cert
    cd cert
    ```

2. Run the following command to generate a self-signed certificate:
    ```bash
    openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
    ```

3. Follow the prompts to fill in the certificate details (e.g., country, organization, etc.).

4. Place the `key.pem` and `cert.pem` files in the `cert` directory.

# API Endpoints

## Validate Card
- **Endpoint**: `/api/card_reader/validate_card`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "cardID": "string",
    "readerID": "string",
    "timestamp": "string"
  }
  ```
- **Response**:
  ```json
  {
    "readerID": "string",
    "accessGranted": true
  }
  ```

## Log Access
- **Endpoint**: `/api/card_reader/log_access`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "cardID": "string",
    "readerID": "string",
    "timestamp": "string",
    "accessGranted": true
  }
  ```
- **Response**:
  ```json
  {
    "status": "success"
  }
  ```

## Log Door State
- **Endpoint**: `/api/card_reader/log_door_state`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "readerID": "string",
    "timestamp": "string",
    "doorState": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success"
  }
  ```
