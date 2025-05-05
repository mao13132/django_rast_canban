import React from 'react';
import styles from './ProfileEdit.module.css';
import Header from '../../components/Header';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileEditForm from '../../components/Profile/ProfileEditForm';
import ProfilePasswordForm from '../../components/Profile/ProfilePasswordForm';
import ProfileEditActions from '../../components/Profile/ProfileEditActions';

const ProfileEdit = () => {
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
          <div className={styles.forms}>
            <ProfileEditForm />
            <ProfilePasswordForm />
          </div>
          <ProfileEditActions />
        </div>


      </main>
    </div>
  );
};

export default ProfileEdit; 