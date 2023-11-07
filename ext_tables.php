<?php

if (!defined('TYPO3')) {
    die('Access denied.');
}

(function () {
    $iconProviderConfiguration = [
        \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class => [
            'actions-localize-deepl' => ['source' => 'EXT:td_deepltranslate/Resources/Public/Icons/actions-localize-deepl.svg'],
            'actions-localize-google' => ['source' => 'EXT:td_deepltranslate/Resources/Public/Icons/actions-localize-google.svg'],
        ],
    ];

    $iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
    foreach ($iconProviderConfiguration as $provider => $iconConfiguration) {
        foreach ($iconConfiguration as $identifier => $option) {
            $iconRegistry->registerIcon($identifier, $provider, $option);
        }
    }

    $GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['EXT:backend/Resources/Private/Language/locallang_layout.xlf'][] = 'EXT:td_deepltranslate/Resources/Private/Language/locallang.xlf';

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addLLrefForTCAdescr('tx_tddeepltranslate_domain_model_glossaries', 'EXT:td_deepltranslate/Resources/Private/Language/locallang_csh_tx_tddeepltranslate_domain_model_glossaries.xlf');
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::allowTableOnStandardPages('tx_tddeepltranslate_domain_model_glossaries');

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addLLrefForTCAdescr('tx_tddeepltranslate_domain_model_glossariessync', 'EXT:td_deepltranslate/Resources/Private/Language/locallang_csh_tx_tddeepltranslate_domain_model_glossariessync.xlf');
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::allowTableOnStandardPages('tx_tddeepltranslate_domain_model_glossariessync');
})();
