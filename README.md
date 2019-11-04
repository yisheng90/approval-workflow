# approval-wrokflow

### Installation

To start the server

```
yarn install
yarn start
```

### Usage

The application comes with the following api endpoints

- GET `/` : return a list of programs.

  Response
  ```
  {
      "data": [
          {
              "_id": "6bcb9163-c091-4706-9132-2ac2a5133545",
              "status": "pending",
              "transitions": [
                  "approve",
                  "reject"
              ]
          },
          {
              "_id": "9f98bf73-b242-4a02-9f63-4c4afa931cd8",
              "status": "pending",
              "transitions": [
                  "approve",
                  "reject"
              ]
          }
        ]
   }
  ```

- POST `/new` : create a new program
  
  Body 
  - title: Optional
  - status: Optional

  Response
  ```
  { "data": {"_id": "6bcb9163-c091-4706-9132-2ac2a5133545"}}
  ```
  
- PUT `/:id/transition?action=hold` : update program status
  
  Query 
  - action: `hold` or `approve` or `reject`

  Response
  ```
  { "data": {"success": true}}
  ```
  
- DELETE `/:id` : detele program

  Response
  ```
  { "data": {"success": true}}
  ```

### Test

To run the unit test.

```
yarn test
```


