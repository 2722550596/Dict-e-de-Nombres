import { useState, useEffect, ReactNode } from 'react';

interface RouterProps {
  children: ReactNode;
}

export const Router = ({ children }: RouterProps) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigateTo = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    const handleMessage = (event: MessageEvent) => {
      console.log('Router received message:', event.data);
      if (event.data.type === 'navigate') {
        console.log('Navigating to:', event.data.path);
        navigateTo(event.data.path);
      } else if (event.data.type === 'languageChange') {
        console.log('Language change received:', event.data);
        // 更新localStorage以触发主页面的语言变化
        if (event.data.languageType === 'interface') {
          localStorage.setItem('selectedLanguage', event.data.language);
        } else if (event.data.languageType === 'dictation') {
          localStorage.setItem('selectedDictationLanguage', event.data.language);
        }
        // 手动触发storage事件，因为同一个窗口的localStorage变化不会自动触发
        window.dispatchEvent(new StorageEvent('storage', {
          key: event.data.languageType === 'interface' ? 'selectedLanguage' : 'selectedDictationLanguage',
          newValue: event.data.language,
          oldValue: null,
          storageArea: localStorage
        }));
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('message', handleMessage);
    };
  }, [currentPath]); // 添加依赖

  // 将导航函数暴露到全局，方便其他组件使用
  useEffect(() => {
    (window as any).navigateTo = navigateTo;
  }, [navigateTo]);

  if (currentPath === '/voice-test') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        backgroundColor: 'white'
      }}>
        <iframe
          src="/voice-test.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title="Voice Test"
          onLoad={() => console.log('Voice test iframe loaded')}
        />
      </div>
    );
  }

  return <>{children}</>;
};
