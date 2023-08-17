import fs from 'fs';

async function readJsonFile(filePath){
    try{
        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    }catch (err){
        console.error('Error reading JSON file:', err);
    }
}


const allData = await readJsonFile('./data.json');

export const events = allData.events;
export let locations = allData.locations;
export let users = allData.users;
export let participants = allData.participants;




