### use notion-localize & i18next to localize your product



- Installation

```
npm i notion-localize-i18next
```


- Basic usage

create scripts dir in your project and add bellow script

set the input path and the configuration of [notion-localize](https://www.npmjs.com/package/notion-localize)

```
import notionLocalizei18next from  'notion-localize-i18next';

notionLocalizei18next({
    input: './src/**/*.{js,jsx,ts,tsx}',
    notionLocalizeConfig: {
        token: 'your Notion integration token',
        databaseId: 'your notion databse id',
        labelKey: 'optional: label of the databse, default is Label',
        localePath: "optional: locale folder path, eg. './src/locale/$LOCALE/$NAMESPACE.json'"
    }
});

```

run the script when you need to sync the translation between Notion and your project