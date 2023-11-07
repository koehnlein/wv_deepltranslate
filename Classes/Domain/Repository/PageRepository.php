<?php

declare(strict_types=1);

namespace TimDreier\TdDeepltranslate\Domain\Repository;

use TYPO3\CMS\Core\Database\Connection;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Utility\GeneralUtility;

final class PageRepository
{
    /**
     * @param array{uid: int} $targetLanguage
     */
    public function markPageAsTranslatedWithDeepl(int $pageId, array $targetLanguage): void
    {
        GeneralUtility::makeInstance(ConnectionPool::class)
        ->getConnectionForTable('pages')
        ->update(
            'pages',
            [
                'tx_tddeepltranslate_content_not_checked' => 1,
                'tx_tddeepltranslate_translated_time' => time(),
            ],
            [
                'l10n_parent' => $pageId,
                'sys_language_uid' => $targetLanguage['uid'],
            ],
            [
                Connection::PARAM_INT,
                Connection::PARAM_INT,
            ]
        );
    }
}
