import express from 'express';
import fileUploadMw from 'express-fileupload';
import { defaultHandler } from '@reshuffle/server-function';
import { authHandler } from '@reshuffle/passport';

const app = express();

app.use(authHandler);

// Example of accessing a user
//
// app.get('/hello-user', (req, res) => {
//   console.log(`This is a user ${req.user}`);
// });



app.post('/image-upload', fileUploadMw(), (req, res) => {
  console.log('yo');
  console.log(req.files);

  res.end(JSON.stringify({ok: true}));
})

app.use(defaultHandler)
export default app;
