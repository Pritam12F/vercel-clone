# This is a vercel clone made using node js, express, react and typescript

It is divided into three parts - 

1. Upload service - For cloning the github repo and uploading it to R2
2. Deploy service - Copying over the github repo from R2, building it and sending the assets to R2 again
3. Request handler service - Handling all the requests that come to id.localhost:3001/ and routing them to the required file

## This project only works with React projects as SSR is not taken into account here

4. Lastly the frontend, which lets users put their github repo url and hits the upload service which then starts the whole process of deploying
