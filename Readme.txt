# Start server
    node server.js

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
    "status": "success"
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
