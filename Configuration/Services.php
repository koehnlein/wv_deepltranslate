<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use TYPO3\CMS\Core\Cache\CacheManager;
use TYPO3\CMS\Core\Cache\Frontend\FrontendInterface;
use TimDreier\TdDeepltranslate\Command\GlossaryCleanupCommand;
use TimDreier\TdDeepltranslate\Command\GlossaryListCommand;
use TimDreier\TdDeepltranslate\Command\GlossarySyncCommand;
use TimDreier\TdDeepltranslate\Service\DeeplGlossaryService;
use TimDreier\TdDeepltranslate\Service\DeeplService;

return function (ContainerConfigurator $containerConfigurator, ContainerBuilder $containerBuilder) {
    $services = $containerConfigurator
        ->services();
    $services->defaults()
        ->autowire()
        ->autoconfigure();

    // Main DI
    $services
        ->load('TimDreier\\TdDeepltranslate\\', '../Classes/')
        ->exclude('../Classes/{Domain/Model,Override/DatabaseRecordList.php}');

    // register console commands
    $services
        ->set(GlossaryCleanupCommand::class)
        ->tag(
            'console.command',
            [
                'command' => 'deepl:glossary:cleanup',
                'schedulable' => true,
            ]
        );
    $services
        ->set(GlossarySyncCommand::class)
        ->tag(
            'console.command',
            [
                'command' => 'deepl:glossary:sync',
                'schedulable' => true,
            ]
        );
    $services
        ->set(GlossaryListCommand::class)
        ->tag(
            'console.command',
            [
                'command' => 'deepl:glossary:list',
                'schedulable' => false,
            ]
        );

    // add caching
    $services->set('cache.tddeepltranslate')
        ->class(FrontendInterface::class)
        ->factory([service(CacheManager::class), 'getCache'])
        ->args(['tddeepltranslate']);
    $services
        ->set(DeeplService::class)
        ->args(['cache', service('cache.tddeepltranslate')]);
    $services
        ->set(DeeplGlossaryService::class)
        ->args(['cache', service('cache.tddeepltranslate')]);
};
