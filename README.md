# Stock Website
## Installation for local dev environment
- Clone project
  
`git clone https://github.com/haianh63/stock-price-web.git`

- Install backend (server) dependencies

```
cd backend
pip install -r requirements.txt
```

- Install frontend (client) dependencies
```
cd frontend
npm install
```

## Env file
- Create .env file in backend folder and replace with your own ssi api (consumer_id and consumer_secret), huggingface api key,...
```
CONSUMER_ID=xxxx
CONSUMER_SECRET=xxxx
REDIS_PORT=xxxx
REDIS_HOST=xxxx
HF_API_KEY=xxxx
VECTORDB_PATH=xxxx
```

## Run project
- Run client
```
cd frontend
npm run dev
```

- Run server
```
cd backend
python main.py
```
