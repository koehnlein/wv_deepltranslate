<?php

if (!defined('TYPO3')) {
    die();
}

(static function (): void {
    $ll = function (string $languageKey) {
        return sprintf(
            'LLL:EXT:td_deepltranslate/Resources/Private/Language/locallang.xlf:%s',
            $languageKey
        );
    };

    $GLOBALS['TCA']['pages']['columns']['module']['config']['items'][] = [
        'DeepL Glossary',
        'glossary',
        'apps-pagetree-folder-contains-glossary',
    ];
    $GLOBALS['TCA']['pages']['ctrl']['typeicon_classes']['contains-glossary']
        = 'apps-pagetree-folder-contains-glossary';

    $columns = [
        'tx_tddeepltranslate_content_not_checked' => [
            'exclude' => 0,
            'l10n_display' => 'hideDiff',
            'displayCond' => 'FIELD:sys_language_uid:>:0',
            'label' => $ll('pages.tx_tddeepltranslate_content_not_checked'),
            'config' => [
                'type' => 'check',
                'items' => [
                    [
                        $ll('traslated_with_deepl'),
                    ],
                ],
            ],
        ],
        'tx_tddeepltranslate_translated_time' => [
            'exclude' => 0,
            'l10n_display' => 'hideDiff',
            'displayCond' => 'FIELD:sys_language_uid:>:0',
            'label' => $ll('pages.tx_tddeepltranslate_translated_time'),
            'config' => [
                'type' => 'input',
                'renderType' => 'inputDateTime',
                'eval' => 'datetime',
                'readOnly' => true,
                'default' => 0,
            ],
        ],
        'glossary_information' => [
            'label' => $ll('pages.glossary_information'),
            'displayCond' => [
                'AND' => [
                    'FIELD:doktype:=:254',
                    'FIELD:module:=:glossary',
                ],
            ],
            'config' => [
                'type' => 'inline',
                'readOnly' => true,
                'foreign_table' => 'tx_tddeepltranslate_glossary',
                'foreign_field' => 'pid',
            ],
        ],
    ];

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('pages', $columns);

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addFieldsToPalette(
        'pages',
        'deepl_translate',
        'tx_tddeepltranslate_content_not_checked, tx_tddeepltranslate_translated_time,glossary_information'
    );

    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes(
        'pages',
        sprintf('--div--;%s,--palette--;;deepl_translate;', $ll('pages.deepl.tab.label')),
        '',
        'after:language'
    );
})();
