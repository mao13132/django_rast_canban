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
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Профиль пользователя</h1>
        <ProfileHeader />
        <div className={styles.forms}>
          <ProfileEditForm />
          <ProfilePasswordForm />
        </div>
        <ProfileEditActions />
      </main>
    </div>
  );
};

export default ProfileEdit; 