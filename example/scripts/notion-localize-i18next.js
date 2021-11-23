import notionLocalizei18next from  '../../packages/notion-localize-i18next';

notionLocalizei18next({
    input: './src/**/*.{js,jsx,ts,tsx}',
    notionLocalizeConfig: {
        databaseId : '',
        token : '',
        localePath: './src/locale/$LOCALE/$NAMESPACE.json'
    }
});
