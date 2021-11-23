
#### use Notion table databse manage localization and translation 

- Status

    ![npm version](https://img.shields.io/npm/v/notion-localize)
    ![downloads](https://img.shields.io/npm/dm/notion-localize.svg)
- Installation

```
npm i notion-localize
```
- Basic usage


Follow this [Share a database with your integration](https://developers.notion.com/docs/getting-started#share-a-database-with-your-integration) to create a Notion table database (inline) and set the integration

The database will be like this:

![](https://raw.githubusercontent.com/wengcan/localize/main/packages/notion-localize/assets/WX20211122-002302.png)


Sync the database to project locale dir:

```
import NotionLocalize from "notion-localize";

const notionLocalize = new NotionLocalize({
    token: 'your Notion integration token',
    databaseId: 'your notion databse id',
    labelKey: 'optional: label of the databse, default is Label',
    localePath: "optional: locale folder path, eg. './src/locale/$LOCALE/$NAMESPACE.json'"
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
    'homepage.title',
    'simpleContent'
]);
```




