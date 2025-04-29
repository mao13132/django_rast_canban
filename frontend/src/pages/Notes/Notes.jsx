import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import NoteList from '../../components/Notes/NoteList/NoteList';
import SearchBar from '../../components/Notes/SearchBar/SearchBar';
import SubHeader from '../../components/SubHeader/SubHeader';
import TaskControls from '../../components/TaskControls/TaskControls';
import styles from './Notes.module.css';

const Notes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateNote = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className={styles.notesContainer}>
      <main className={styles.notes}>
        <Header
          navigationLinks={[
            { label: 'Главная страница', path: '/' },
            { label: 'Файлы', path: '/files' }
          ]}
        />

        <div className={styles.contentWrapper}>
          <SubHeader
            title="Заметки"
            navLinks={[
              { label: 'Заметки', path: '/notes', isActive: true },
              { label: 'Архив заметок', path: '/archive' },
              { label: 'Хранилище', path: '/files' }
            ]}
            rightComponent={<TaskControls />}
          />

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Поиск задач'
          />

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <div className={styles.createForm}>

                <div className={styles.pinnedWrapperIcon}>
                  <img src={"/assets/pinned.png"} alt="Закрепить" className={styles.logoImage} />
                </div>

                <div className={styles.createFormIcons}>
                  <div className={styles.iconWrapper}>
                    <img src={"/assets/sortText.png"} alt="Заметки" className={styles.textIcon} />
                  </div>
                  <div className={styles.iconWrapper}>
                    <img src={"/assets/bold.png"} alt="Заметки" className={styles.textIcon} />
                  </div>
                  <div className={styles.iconWrapper}>
                    <img src={"/assets/inline.png"} alt="Заметки" className={styles.textIcon} />
                  </div>
                  <div className={styles.iconWrapper}>
                    <img src={"/assets/u.png"} alt="Заметки" className={styles.textIcon} />
                  </div>
                  <div className={styles.iconWrapper}>
                    <img src={"/assets/text.png"} alt="Заметки" className={styles.textIcon} />
                  </div>
                </div>

              </div>
            </div>


            <section className={styles.otherSection}>
              <h2>Другие заметки</h2>
              <NoteList type="other" searchQuery={searchQuery} />
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Notes;