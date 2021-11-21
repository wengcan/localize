interface IConstructorParams{
    token: string;
    databaseId: string;
    labelKey?: string;
    localePath?: string;
    namespace?: string;
}

interface ITextBlock{
    plain_text?: any;
    "text": {
        "content": string;
    }
}


interface ITransItem{
    [key: string] : string;
}
interface ITranslations{
    [key: string] : ITransItem;
}

interface ILangContents {
    [key: string] : { rich_text: [ ITextBlock ] }
}


interface IProperty{
    [key: string] : { id?: 'title', type?: 'title', title?: ITextBlock[] , rich_text?: ITextBlock []}
}

interface IResp{
    results:{
        properties: IProperty;
    }[];
    has_more: boolean;
    next_cursor?: string;
}