import path from 'path';
import fs from 'fs';
import os from 'os';
import fetch from 'node-fetch';
import setValue from './setValue';
//import {exec} from 'child_process';


class NotionLocalize {
    #labelKey;
    #token = null;
    #databaseId = null;
    #localePath = '';
    defaultNotionVersion = "2021-08-16"
    constructor({
        token,
        databaseId,
        labelKey = 'Label',
        localePath = "./"
    }) {
        this.#labelKey = labelKey;
        this.#token = token;
        this.#databaseId = databaseId;
        this.#localePath = localePath;
    }
    get #headers(){
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.#token}`,
            'Notion-Version': this.defaultNotionVersion
        }
    }
    #textBlock(content){
        return {
            "text": {
                "content": content
            }
        };
    }
    #queryTranslations(cur) {
        const body = !!cur ? { "start_cursor": cur } : {};
        return fetch(`https://api.notion.com/v1/databases/${this.#databaseId}/query`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: this.#headers,
        })
            .then(res => res.json())
    }
    #add(properties){
        return fetch(`https://api.notion.com/v1/pages`, {
            method: 'post',
            body:    JSON.stringify({
                "parent": { "database_id": this.#databaseId },              
                "properties": properties
            }),
            headers: this.#headers,
        })
        .then(res => res.json());
    }
    addTranslation(langs, keys) {
        const emptyLangContents = langs.reduce((prev, current)=>{
            prev[current] = { rich_text: [ this.#textBlock('') ] };
            return prev;
        },{});

        return Promise.all(
            keys.map(k=>{
                this.#add({
                    ...emptyLangContents,
                    [this.#labelKey]: { id: 'title', type: 'title', title: [ this.#textBlock(k) ] }
                })
            })
        );
    }
    #witeLocaleFile(lang, data){
        fs.writeFileSync(path.resolve(__dirname, `${this.#localePath}/${lang}.json`), JSON.stringify(data, null, 2))
    }
    async #queryAll() {
        let end = false;
        let cur = null;
        let results = [];
        let transKeys = [];
        while (!end) {
            const res = await this.#queryTranslations(cur);
            end = !res.has_more;
            cur = res.next_cursor;

            transKeys = transKeys.length === 0 ?
                Object.keys(res.results[0].properties).filter(item => item !== this.#labelKey) :
                transKeys;
            results = results.concat(res.results);
        }
        return [transKeys, results];
    }

    async run() {
        const translations = {};
        const [transKeys, results] = await this.#queryAll();
        transKeys.forEach(item=>{
            translations[item] = {};
        });
        for(var i in results){
            const item = results[i];
            const properties = item.properties;
            const title = properties[this.#labelKey].title;
            const titleText = title[0].plain_text;
            for(var lang in properties){
                const langItem = properties[lang];
                if(langItem.type === "title"){
                    continue;
                };
                if( langItem.rich_text[0] && langItem.rich_text[0].plain_text !== ''){
                    setValue(translations, lang + '.' + titleText, langItem.rich_text[0].plain_text);
                }
            }
        }

        for(var lang in translations){
            this.#witeLocaleFile(lang, translations[lang]);
        };
    }

}
export default NotionLocalize;
