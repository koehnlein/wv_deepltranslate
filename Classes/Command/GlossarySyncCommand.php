<?php

declare(strict_types=1);

namespace TimDreier\TdDeepltranslate\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use TYPO3\CMS\Core\Exception\SiteNotFoundException;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TimDreier\TdDeepltranslate\Domain\Repository\GlossaryRepository;
use TimDreier\TdDeepltranslate\Service\DeeplGlossaryService;

class GlossarySyncCommand extends Command
{
    protected DeeplGlossaryService $deeplGlossaryService;

    protected GlossaryRepository $glossaryRepository;

    public function __construct(
        string $name = null,
        ?DeeplGlossaryService $deeplGlossaryService = null,
        ?GlossaryRepository $glossaryRepository = null
    ) {
        parent::__construct($name);
        $this->deeplGlossaryService = $deeplGlossaryService
            ?? GeneralUtility::makeInstance(DeeplGlossaryService::class);
        $this->glossaryRepository = $glossaryRepository
            ?? GeneralUtility::makeInstance(GlossaryRepository::class);
    }

    protected function initialize(
        InputInterface $input,
        OutputInterface $output
    ): void {
        $this->setDescription('Sync all glossaries to DeepL API')
            ->addOption(
                'pageId',
                'p',
                InputOption::VALUE_OPTIONAL,
                'Page to sync, not set, sync all glossaries',
                0
            );
    }

    /**
     * @throws SiteNotFoundException
     */
    protected function execute(
        InputInterface $input,
        OutputInterface $output
    ): int {
        $pageId = (int)$input->getOption('pageId');
        $glossaries = [$pageId];
        if ($pageId === 0) {
            $glossaries = $this->glossaryRepository->findAllGlossaries();
        }

        foreach ($glossaries as $glossary) {
            $this->deeplGlossaryService->syncGlossaries($glossary['uid']);
        }

        return Command::SUCCESS;
    }
}
