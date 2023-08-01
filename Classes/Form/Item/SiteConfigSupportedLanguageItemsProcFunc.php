<?php

declare(strict_types=1);

namespace WebVision\WvDeepltranslate\Form\Item;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use WebVision\WvDeepltranslate\Service\DeeplService;

class SiteConfigSupportedLanguageItemsProcFunc
{
    /**
     * @var DeeplService
     */
    private $deeplService;

    public function __construct()
    {
        $this->deeplService = GeneralUtility::makeInstance(DeeplService::class);
    }

    public function getSupportedLanguageForField(array &$configuration)
    {
        $supportedLanguages = $this->deeplService->apiSupportedLanguages['target'];

        $configuration['items'][] = [
            'label' => '',
            'value' => ''
        ];
        foreach ($supportedLanguages as $supportedLanguage) {
            $configuration['items'][] = [
                'label' => $supportedLanguage,
                'value' => $supportedLanguage
            ];
        }
    }
}
