import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import { createClient } from 'redis';
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {


  await client.connect();

  // await client.set('key', 'value');
  // const value = await client.get('key');
})();
const app = express()
dotenv.config()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.get('/', async(req, res) => {
  try {
    const scores=await client.get('scores')
    return res.json({scores:JSON.parse(scores) })
  } catch (error) {
    return res.json({error})
  }
})
app.post('/', async(req, res) => {
  // console.log(req.body);
  const {scores}=req.body
  try {
    await client.set('scores',JSON.stringify(scores))
    return res.json({success:true})
  } catch (error) {
    return res.json({success:error})
  }
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`))
