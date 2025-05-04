import React from 'react';
import styles from './Profile.module.css';
import Header from '../../components/Header';
import ProfileHeader from '../../components/Profile/ProfileHeader';

const Profile = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Header
          navigationLinks={[
            { label: 'Главная страница', path: '/' },
            { label: 'Доска задач', path: '/dashboard' }
          ]}
        />

        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>Профиль пользователя</h1>
          <ProfileHeader />

        </div>

      </main>
    </div>
  );
};

export default Profile; 