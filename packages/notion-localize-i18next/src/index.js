import NotionLocalize from "notion-localize";
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import  {exec}  from 'child_process';
import jsonToKeys from "./jsonToKeys";


export default async  function notionLocalizei18next({
  input,
  notionLocalizeConfig
}){
  const inputPath = path.resolve(
    cwd(), 
    input
  );
  const configPath = path.resolve(
    path.dirname(''), 
    '../i18next-parser.config.js'
  );
  const tempTranslationFile = path.resolve(cwd(),  `.temp/translation.json`);
  const notionLocalize = new NotionLocalize(notionLocalizeConfig);
  await notionLocalize.run();
  const remoteKeys = notionLocalize.keys;
  exec(`npx i18next '${inputPath}' -c '${configPath}'  -o  ${tempTranslationFile} `, async(error) => {
   if( error !== null) throw error;
    const tempTranslationData = fs.readFileSync(tempTranslationFile, 'utf8');
    const tempTranslationJson = JSON.parse(tempTranslationData);
    const missingKeys = jsonToKeys(tempTranslationJson).filter(key=> ! remoteKeys.includes(key));
    await notionLocalize.addTranslationKeys(missingKeys);
    fs.rmdirSync( path.dirname(tempTranslationFile), { recursive: true });
  });
}
