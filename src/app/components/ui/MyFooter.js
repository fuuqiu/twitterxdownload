'use client';

import { getTranslation } from '@/lib/i18n';
import { Link, Chip } from '@heroui/react';
import { useEffect } from 'react';

export default function MyFooter({ locale = 'en' }) {
    const t = function(key){
        return getTranslation(locale, key);
    }

    useEffect(() => {
        // 清理旧的 Twitter widgets
        if (window.twttr) {
            delete window.twttr;
        }

        // 移除已存在的 Twitter script
        const existingScript = document.querySelector('script[src*="platform.twitter.com"]');
        if (existingScript) {
            existingScript.remove();
        }

        // 加载 Twitter widget JS
        const script = document.createElement('script');
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        
        // 监听脚本加载完成
        script.onload = () => {
            // 确保 widgets 已加载
            if (window.twttr) {
                window.twttr.widgets.load();
                // 设置主题
                updateTwitterTheme();
            }
        };
        
        document.body.appendChild(script);

        // 监听主题变化，更新 Twitter 按钮
        const updateTwitterTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            if (window.twttr && window.twttr.widgets) {
                window.twttr.widgets.createFollowButton(
                    process.env.NEXT_PUBLIC_TWITTER_USERNAME,
                    document.querySelector('#twitter-follow-container'),
                    {
                        size: 'large',
                        showCount: false,
                        theme: isDark ? 'dark' : 'light'
                    }
                );
            }
        };

        // 创建观察器监听主题变化
        const observer = new MutationObserver(() => {
            const twitterContainer = document.querySelector('#twitter-follow-container');
            if (twitterContainer) {
                twitterContainer.innerHTML = ''; // 清除现有按钮
                updateTwitterTheme(); // 重新创建按钮
            }
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => {
            observer.disconnect();
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return (
        <div className="page-container p-10">
            <div className="flex flex-col md:flex-row justify-between gap-8">
                {/* 左侧区域 */}
                <div className="flex flex-col gap-2 md:w-1/2 lg:w-2/5">
                    <div className="flex items-center gap-1">
                        <p className="text-xl font-bold mb-2 w-fit dark:text-white">{t('TwitterXDownload')}</p>
                        <Link href="https://github.com/ezshine/twitterxdownload" target="_blank">
                            <Chip color="danger" size="sm" variant="flat" className="ml-2 -mt-1.5">v{process.env.APP_VERSION}</Chip>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">{t('The fastest and most reliable Twitter video downloader. Free to use, no registration required.')}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2024 <a href="https://twitterxdownload.com" target="_blank" className="hover:text-primary dark:hover:text-primary-400">TwitterXDownload</a> {t('All rights reserved.')}
                        </p>
                        <div id="twitter-follow-container" className="!min-w-[160px] overflow-hidden"></div>
                    </div>
                </div>

                {/* 中间区域 */}
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-bold mb-2 dark:text-white">{t('Other Links')}</p>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/about-us" className="text-sm hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">{t('About Us')}</Link></li>
                            <li><Link href="/privacy-policy" className="text-sm hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">{t('Privacy Policy')}</Link></li>
                            <li><Link href="/terms-of-service" className="text-sm hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">{t('Terms of Service')}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* 右侧区域 */}
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-bold mb-2 dark:text-white">{t('Contact Us')}</p>    
                        <Link href="mailto:support@twitterxdownload.com" className="text-sm hover:text-primary dark:text-gray-400 dark:hover:text-primary-400">support@twitterxdownload.com</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}