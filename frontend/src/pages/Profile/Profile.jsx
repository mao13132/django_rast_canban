import React from 'react';
import styles from './Profile.module.css';
import Header from '../../components/Header';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import ProfileActions from '../../components/Profile/ProfileActions';

const Profile = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Профиль пользователя</h1>
        <ProfileHeader />
        <ProfileInfo />
        <ProfileActions />
      </main>
    </div>
  );
};

export default Profile; 