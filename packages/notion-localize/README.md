
#### use Notion table databse management localization and translation 

- Status

    ![npm version](https://img.shields.io/npm/v/notion-localize)
    ![downloads](https://img.shields.io/npm/dm/notion-localize.svg)
- Installation

```
npm i notion-localize
```
- Basic usage


follow this [Share a database with your integration](https://developers.notion.com/docs/getting-started#share-a-database-with-your-integration) to create a Notion table database (inline) and set the integration

Sync the database to project locale dir:

```
import NotionLocalize from "notion-localize";

const notionLocalize = new NotionLocalize({
    token: 'your Notion integration token',
    databaseId: 'your notion databse id',
    labelKey: 'optional: label of the databse',
    localePath: "optional: locale folder path"
});

notionLocalize.run();

```

Get all the keys:

```
console.log(notionLocalize.keys);
```

Add some keys to Notion database:

```
notionLocalize.addTranslationKeys([
    'nameTitle',
    'simpleContent'
]);
```




