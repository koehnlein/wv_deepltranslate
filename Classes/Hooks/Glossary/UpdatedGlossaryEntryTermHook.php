<?php

declare(strict_types=1);

namespace TimDreier\TdDeepltranslate\Hooks\Glossary;

use TYPO3\CMS\Core\DataHandling\DataHandler;
use TYPO3\CMS\Core\Messaging\FlashMessage;
use TYPO3\CMS\Core\Messaging\FlashMessageService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Utility\LocalizationUtility;
use TimDreier\TdDeepltranslate\Domain\Repository\GlossaryEntryRepository;
use TimDreier\TdDeepltranslate\Domain\Repository\GlossaryRepository;

class UpdatedGlossaryEntryTermHook
{
    private GlossaryRepository $glossaryRepository;

    private GlossaryEntryRepository $glossaryEntryRepository;

    public function __construct(
        ?GlossaryRepository $glossaryRepository = null,
        ?GlossaryEntryRepository $glossaryEntryRepository = null
    ) {
        $this->glossaryRepository = $glossaryRepository ?? GeneralUtility::makeInstance(GlossaryRepository::class);
        $this->glossaryEntryRepository = $glossaryEntryRepository ?? GeneralUtility::makeInstance(GlossaryEntryRepository::class);
    }

    /**
     * @param int|string $id
     * @param array{glossary: int} $fieldArray
     */
    public function processDatamap_afterDatabaseOperations(
        string $status,
        string $table,
        $id,
        array $fieldArray,
        DataHandler $dataHandler
    ): void {
        if ($status !== 'update') {
            return;
        }

        if ($table !== 'tx_tddeepltranslate_glossaryentry') {
            return;
        }

        $glossary = $this->glossaryEntryRepository->findEntryByUid($id);

        if (empty($glossary)) {
            return;
        }

        $this->glossaryRepository->setGlossaryNotSyncOnPage($glossary['pid']);

        $flashMessage = new FlashMessage(
            LocalizationUtility::translate(
                'glossary.not-sync.message',
                'td_deepltranslate'
            ),
            LocalizationUtility::translate(
                'glossary.not-sync.title',
                'td_deepltranslate'
            ),
            FlashMessage::INFO,
            true
        );

        GeneralUtility::makeInstance(FlashMessageService::class)
            ->getMessageQueueByIdentifier()
            ->enqueue($flashMessage);
    }
}
