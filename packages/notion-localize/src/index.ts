 ///<reference path="./index.d.ts" />
import path from 'path';
import fs from 'fs';
import setValue from './setValue';
import httpsPost from './httpsPost';
import { cwd } from 'process';


export default class NotionLocalize {
    private labelKey;
    private token;
    private databaseId;
    private localePath = '';
    private defaultNamespace = "main";
    private defaultNotionVersion = "2021-08-16"
    private langs: string[] = [];
    keys: string[] = [];
    constructor({
        token,
        databaseId,
        labelKey = 'Label',
        localePath = "./$LOCALE/$NAMESPACE.json",
        namespace = "main"
    }: IConstructorParams) {
        this.labelKey = labelKey;
        this.token = token;
        this.databaseId = databaseId;
        this.localePath = localePath;
        this.defaultNamespace = namespace
    }
    private get headers(){
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
            'Notion-Version': this.defaultNotionVersion
        }
    }
    private textBlock(content: string): ITextBlock{
        return {
            "text": {
                "content": content
            }
        };
    }
    private queryTranslations(cur?: string) {
        const body = !!cur ? { "start_cursor": cur } : {};
        return httpsPost({
            hostname: 'api.notion.com',
            path: `/v1/databases/${this.databaseId}/query`,
            headers: this.headers,
            body:JSON.stringify(body)
        });
    }
    private add(properties: IProperty){
        return httpsPost({
            hostname: 'api.notion.com',
            path: `/v1/pages`,
            headers: this.headers,
            body:JSON.stringify({
                "parent": { "database_id": this.databaseId },              
                "properties": properties
            })
        });
    }
    async addTranslationKeys( keys: string[]): Promise<void> {
        const emptyLangContents = this.langs.reduce((prev, current)=>{
            prev[current] = { rich_text: [ this.textBlock('') ] };
            return prev;
        },{} as ILangContents);

        let index = 0;
        while(index < keys.length){
            await this.add({
                ...emptyLangContents,
                [this.labelKey]: { id: 'title', type: 'title', title: [ this.textBlock(keys[index]) ] }
            })
            index += 1;
        }
        return;
    }
    private witeLocaleFile(lang: string, data: ITransItem){

        const output = path.resolve(
            cwd(), 
            this.localePath.replace('$LOCALE',lang).replace('$NAMESPACE', this.defaultNamespace)
        );

        try {
            fs.mkdirSync(path.dirname(output), { recursive: true } );
        } catch (e) {
            console.log('Cannot create folder ', e);
        }
        fs.writeFileSync(
            output, 
            JSON.stringify(data, null, 2)
        )
    }
    private async queryAll():Promise<[
        string[],
        IResp['results']
    ]> {
        let end = false;
        let cur;
        let results: IResp['results'] = [];
        let transKeys: string[] = [];
        while (!end) {
            const res = await this.queryTranslations(cur) as  IResp;
            end = !res.has_more;
            cur = res.next_cursor;

            transKeys = transKeys.length === 0 ?
                Object.keys(res.results[0].properties).filter(item => item !== this.labelKey) :
                transKeys;
            results = results.concat(res.results);
        }
        return [transKeys, results];
    }

    async run():Promise<void> {
        const translations : ITranslations = {};
        const [transKeys, results] = await this.queryAll();
        transKeys.forEach(item=>{
            translations[item] = {};
        });
        for(var i in results){
            const item = results[i];
            const properties = item.properties;
            const title = properties[this.labelKey].title;
    
            if(title && undefined === title[0]){
                continue;
            }
            const titleText = title![0].plain_text;

            this.keys.push(titleText);

            for(var lang in properties){
                const langItem = properties[lang];
                if(langItem.type === "title"){
                    continue;
                };

                if( langItem.rich_text && langItem.rich_text[0] && langItem.rich_text[0].plain_text !== ''){
                    setValue(translations, lang + '.' + titleText, langItem.rich_text[0].plain_text);
                }
            }
        }
        this.langs = Object.keys(translations);
        for(var lang in translations){
            this.witeLocaleFile(lang, translations[lang]);
        };
        return;
    }
}
