import React from 'react';
import './FilterModal.css';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    allTags: string[];
    selectedTags: string[];
    toggleTag: (tag: string) => void;
    clearFilters: () => void;
    t: any;
}

export const FilterModal: React.FC<FilterModalProps> = ({
    isOpen,
    onClose,
    allTags,
    selectedTags,
    toggleTag,
    clearFilters,
    t
}) => {
    if (!isOpen) return null;

    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal-content glassmorphism" onClick={e => e.stopPropagation()}>
                <header className="filter-modal-header">
                    <h3>{t.filterByTags || 'Filter by Tags'}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </header>
                <div className="filter-modal-body">
                    <div className="tags-grid">
                        {allTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`tag-filter-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <footer className="filter-modal-footer">
                  <button
                      className={`clear-button${selectedTags.length === 0 ? ' disabled' : ''}`}
                      onClick={clearFilters}
                      disabled={selectedTags.length === 0}
                      tabIndex={selectedTags.length === 0 ? -1 : 0}
                  >
                      {t.clear || 'Clear'}
                  </button>
                    <button className="apply-button" onClick={onClose}>
                        {t.apply || 'Apply'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
