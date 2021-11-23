import { useTranslation } from 'react-i18next';
import './App.css'

function App() {

  const { t, i18n } = useTranslation();
  const language = i18n.language;
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Notion Localize i18next</p>
        <p>
          <button type="button" onClick={() => {
            i18n.changeLanguage(language === 'zh-CN'? 'en-US' : 'zh-CN');
          }}>
             语言 / language
          </button>
        </p>
        <ul>
          <li>{t('products')}</li>
          <li>{t('pricing')}</li>
          <li>{t('documentation')}</li>
          <li>{t('community')}</li>
        </ul>
      </header>
    </div>
  )
}

export default App
