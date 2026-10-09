import React, { useState, useEffect, useRef } from 'react';
import { NovelData, TimelineFilter } from './types';
import { getPresets, getPresetData, PresetItem } from './services/api';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ImportModal } from './components/ImportModal';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('melos');
  const [novel, setNovel] = useState<NovelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Navigation
  const [filter, setFilter] = useState<TimelineFilter>('all');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // Playback / Streaming
  const [displayedCount, setDisplayedCount] = useState<number>(6);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // 1. Initial Load: Fetch Presets and default preset (Melos)
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const presetList = await getPresets();
        setPresets(presetList);

        const defaultData = await getPresetData('melos');
        setNovel(defaultData);
        setDisplayedCount(Math.min(8, defaultData.posts.length));
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // 2. Switch Preset
  const handleSelectPreset = async (presetId: string) => {
    if (presetId === selectedPresetId && novel) return;
    try {
      setLoading(true);
      setIsPlaying(false);
      const data = await getPresetData(presetId);
      setSelectedPresetId(presetId);
      setNovel(data);
      setSelectedCharacterId(null);
      setFilter('all');
      setDisplayedCount(Math.min(8, data.posts.length));
    } catch (err) {
      console.error('Failed to change preset:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Novel Parsed from Gemini Import
  const handleNovelParsed = (parsedNovel: NovelData) => {
    setSelectedPresetId('custom');
    setNovel(parsedNovel);
    setSelectedCharacterId(null);
    setFilter('all');
    setDisplayedCount(Math.min(8, parsedNovel.posts.length));
    setIsPlaying(false);
  };

  // 4. Playback auto-stream timer
  useEffect(() => {
    if (!isPlaying || !novel) {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
      return;
    }

    playTimerRef.current = window.setInterval(() => {
      setDisplayedCount((prev) => {
        if (prev >= novel.posts.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, [isPlaying, novel]);

  const handleTogglePlay = () => {
    if (novel && displayedCount >= novel.posts.length) {
      // Loop from start if reached end
      setDisplayedCount(4);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleShowNext = () => {
    if (novel && displayedCount < novel.posts.length) {
      setDisplayedCount((prev) => prev + 1);
    }
  };

  const handleShowAll = () => {
    if (novel) {
      setDisplayedCount(novel.posts.length);
      setIsPlaying(false);
    }
  };

  const handleResetStream = () => {
    setDisplayedCount(4);
    setIsPlaying(true);
  };

  const selectedCharacter = novel?.characters.find((c) => c.id === selectedCharacterId);

  return (
    <div className="min-h-screen bg-black text-[#e7e9ea] flex justify-center selection:bg-xblue selection:text-white">
      <div className="flex w-full max-w-[1265px] justify-between">
        {/* Left Sidebar */}
        <SidebarLeft
          currentFilter={filter}
          onFilterChange={setFilter}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={setSelectedCharacterId}
          characters={novel?.characters || []}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          totalPosts={novel?.posts.length || 0}
          displayedPosts={displayedCount}
        />

        {/* Main Content / Timeline */}
        <main className="flex-1 max-w-[600px] min-w-0 border-r border-[#2f3336]">
          {loading || !novel ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-xblue" />
              <p className="text-sm text-[#71767b]">青空文庫を読み込み中…</p>
            </div>
          ) : (
            <>
              <Header
                novel={novel}
                filter={filter}
                onFilterChange={setFilter}
                selectedCharacterName={selectedCharacter ? selectedCharacter.name : null}
                onClearCharacter={() => setSelectedCharacterId(null)}
                onResetStream={handleResetStream}
              />
              <Timeline
                posts={novel.posts}
                characters={novel.characters}
                filter={filter}
                selectedCharacterId={selectedCharacterId}
                displayedCount={displayedCount}
                onShowNext={handleShowNext}
                onShowAll={handleShowAll}
                totalPosts={novel.posts.length}
              />
            </>
          )}
        </main>

        {/* Right Sidebar */}
        {novel && (
          <SidebarRight
            currentNovel={novel}
            presets={presets}
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onSelectCharacter={setSelectedCharacterId}
          />
        )}
      </div>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onNovelParsed={handleNovelParsed}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />
    </div>
  );
};

export default App;
