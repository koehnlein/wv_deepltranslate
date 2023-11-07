<?php

return [
    'glossaryupdate' => [
        'path' => '/glossary',
        'target' => TimDreier\TdDeepltranslate\Controller\GlossarySyncController::class . '::update',
    ],
];
